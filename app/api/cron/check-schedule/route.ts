import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize with Service Role Key (Bypasses RLS)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: Request) {
    // 1. Dual-Layer Security Check
    const authHeader = request.headers.get('authorization');
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';

    // Allow if it's Vercel OR if you provided the correct secret key
    if (!isVercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Watchdog Logic
        const now = new Date().toISOString();
        
        const { data: posts, error } = await supabase
            .from('content_schedule')
            .select('*')
            .eq('status', 'pending')
            .lte('date', now);

        if (error) throw error;

        if (!posts || posts.length === 0) {
            return NextResponse.json({ message: 'No posts due.' });
        }

        const results = [];

        // 3. Process Loop
        for (const post of posts) {
            // Format the date nicely
            const postTime = new Date(post.date).toLocaleString('en-US', { 
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

            // Simple "Standard Company" Email Template
            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333;">
                    
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        
                        <div style="margin-bottom: 30px;">
                            <span style="font-weight: 700; font-size: 18px; color: #000000; letter-spacing: -0.5px;">ContentAI</span>
                        </div>

                        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0; color: #111111; letter-spacing: -0.5px;">
                            Your ${post.platform} post is ready
                        </h1>

                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #555555;">
                            This is a reminder to publish your scheduled content. It was scheduled for <strong>${postTime}</strong>.
                        </p>

                        <div style="background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                            <p style="font-size: 15px; line-height: 1.6; margin: 0; color: #333333; font-family: monospace, sans-serif;">
                                ${post.title}
                            </p>
                        </div>

                        <div style="margin-bottom: 40px;">
                            <a href="https://ai-content-generator-blush-one.vercel.app/dashboard/calendar" 
                               style="background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 500; display: inline-block;">
                                View in Dashboard
                            </a>
                        </div>

                        <div style="border-top: 1px solid #eeeeee; padding-top: 20px;">
                            <p style="font-size: 13px; color: #888888; margin: 0;">
                                You are receiving this because you scheduled a post on ContentAI. 
                                <br>
                                <a href="#" style="color: #888888; text-decoration: underline;">Unsubscribe</a>
                            </p>
                        </div>

                    </div>
                </body>
                </html>
            `;

            // Send Email
            if (post.user_email) {
                await resend.emails.send({
                    from: 'ContentAI <onboarding@resend.dev>',
                    to: post.user_email,
                    subject: `Ready to post on ${post.platform}`,
                    html: emailContent,
                });
            }

            // Update Status
            const { error: updateError } = await supabase
                .from('content_schedule')
                .update({ status: 'notified' })
                .eq('id', post.id);

            if (!updateError) {
                results.push({ postId: post.id, status: 'notified' });
            }
        } 

        return NextResponse.json({ success: true, processed: results.length });

    } catch (error: unknown) {
        console.error("Cron Error:", error);
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json(
            { error: 'An error occurred', details: errorMessage }, 
            { status: 500 }
        );
    }
}