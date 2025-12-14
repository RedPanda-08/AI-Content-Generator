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

      // ---- EMAIL TEMPLATE ----
      const emailHtml = `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; border: 1px solid #ddd; overflow: hidden;">

                    <div style="background:#000; padding:24px; text-align:center;">
                        <h1 style="color:#fff; margin:0;">🚀 Your ${post.platform} post is ready</h1>
                    </div>

                    <div style="padding:28px;">
                        <p><strong>Topic:</strong> ${post.title}</p>
                        <p><strong>Scheduled Time:</strong> ${postTime}</p>

                        <hr style="margin:24px 0;" />

                        <p style="font-size:12px; color:#777; font-weight:bold;">
                            COPY & PASTE BELOW
                    </p>

                    <pre style="
                        background:#fafafa;
                        border:1px solid #ccc;
                        border-radius:6px;
                        padding:16px;
                        font-family: monospace;
                        font-size:14px;
                        line-height:1.6;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    ">${post.content}</pre>

                    <div style="text-align:center; margin-top:32px;">
                        <a href="https://ai-content-generator-blush-one.vercel.app/dashboard/calendar"
                        style="background:#000; color:#fff; padding:12px 26px; border-radius:6px; text-decoration:none;">
                        View in Calendar
                        </a>
                    </div>
                    </div>

                    <div style="background:#fafafa; padding:16px; text-align:center;">
                    <p style="font-size:12px; color:#999;">
                        You’re receiving this because you scheduled a post on ContentAI.
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
      await supabase
        .from('content_schedule')
        .update({ status: 'notified' })
        .eq('id', post.id);

      results.push({ id: post.id, status: 'notified' });
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
