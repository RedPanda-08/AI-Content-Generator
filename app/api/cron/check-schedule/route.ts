import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import { Resend } from "resend";

// ---- SUPABASE (Service Role for Cron) ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---- RESEND ----
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: Request) {
  // ---- SECURITY CHECK ----
  const authHeader = request.headers.get('authorization');
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';

  if (!isVercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // ---- FETCH READY POSTS ----
    const { data: posts, error } = await supabase
      .from('content_schedule')
      .select(`
        id,
        title,
        platform,
        content,
        date,
        user_email,
        status
      `)
      .eq('status', 'pending')
      .not('content', 'is', null)
      .neq('content', '')
      .lte('date', now)
      .order('date', { ascending: true });

    if (error) throw error;

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: 'No posts ready to notify.' });
    }

    const results: { id: string; status: string }[] = [];

    // ---- PROCESS POSTS ----
    for (const post of posts) {
      if (!post.content?.trim()) continue;

      // IST time formatting
      const postTime = new Date(post.date).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const emailHtml = `
                <!DOCTYPE html>
            <html lang="en">
            <head>
            <style>
            /* Mobile Container Styling */
            .mobile-screen {
                max-width: 375px; /* Standard iPhone width */
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #F5F7FA;
                margin: 20px auto;
                border: 12px solid #333; /* Phone bezel simulation */
                border-radius: 30px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }

            /* Email Header */
            .email-app-header {
                background-color: #fff;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #007AFF;
                font-size: 14px;
                font-weight: 500;
            }

            /* Email Metadata */
            .email-meta {
                background: #fff;
                padding: 20px;
            }

            .subject-line {
                font-size: 18px;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 12px;
            }

            .sender-info {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
            }

            .avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 12px;
                font-size: 16px;
            }

            .sender-details {
                display: flex;
                flex-direction: column;
            }

            .sender-name {
                font-weight: 600;
                color: #333;
                font-size: 15px;
            }

            .timestamp {
                color: #888;
                font-size: 12px;
            }

            /* Main Body Content */
            .email-body {
                background-color: #fff;
                padding: 0 20px 40px 20px;
                color: #333;
                line-height: 1.6;
            }

            .label {
                text-transform: uppercase;
                color: #888;
                font-size: 11px;
                letter-spacing: 1px;
                font-weight: 600;
                margin-bottom: 5px;
                display: block;
            }

            .topic-content {
                font-size: 22px; 
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 25px;
                line-height: 1.4;
                letter-spacing: -0.3px;
                word-wrap: break-word; 
            }
                .time-text {
                font-size: 17px;
                font-weight: 700;
                letter-spacing: -0.2px;
            }

            .schedule-box {
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 12px;
                padding: 15px;
                display: flex;
                align-items: center;
                color: #166534;
            }

            .clock-icon {
                margin-right: 10px;
                font-size: 20px;
            }
            </style>
            </head>
            <body>

            <div class="mobile-screen">
            <div class="email-app-header">
                <span>&lt; Inbox</span>
                <span>Edit</span>
            </div>

            <div class="email-meta">
                <div class="sender-info">
                <div class="avatar">C</div>
                <div class="sender-details">
                    <span class="sender-name">ContentAI Reminder</span>
                    <span class="timestamp">Today at 8:00 PM</span>
                </div>
                </div>
                
                <div class="subject-line">Reminder: Upcoming Content Task</div>
            </div>

            <div class="email-body">
                
                <span class="label">Task Topic</span>
                <div class="topic-content">
                Create an engaging Instagram caption for a picture of a sunset.
                </div>

                <span class="label">Scheduled For</span>
                <div class="schedule-box">
                <span class="clock-icon">⏰</span>
                <span class="time-text">8:39 PM</span>
                </div>

                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                <a href="#" style="color: #6366f1; text-decoration: none; font-weight: 600;">Open ContentAI Dashboard &rarr;</a>
                </p>

            </div>
            </div>

            </body>
            </html>
        `;

      // ---- SEND EMAIL ----
      if (post.user_email) {
        await resend.emails.send({
          from: 'ContentAI <onboarding@resend.dev>', 
          to: post.user_email,
          subject: `⏰ Ready to post: ${post.title}`,
          html: emailHtml,
        });
      }

      // ---- UPDATE STATUS ----
      const { error: updateError } = await supabase
        .from('content_schedule')
        .update({ status: 'notified' })
        .eq('id', post.id);

      if (updateError) {
          console.error(`Failed to update status for post ${post.id}`, updateError);
      } else {
          results.push({ id: post.id, status: 'notified' });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
    });

  } catch (error: unknown) {
    console.error("Cron Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}