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

            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0f1117; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1117; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                                    
                                    <tr>
                                        <td style="background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%); padding: 4px;">
                                            </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 40px 32px;">
                                            
                                            <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 700; text-align: center;">
                                                ⚡ Content Ready
                                            </h1>
                                            <p style="color: #94a3b8; font-size: 16px; margin: 0 0 32px 0; text-align: center;">
                                                Your scheduled post is due right now.
                                            </p>

                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                                <tr>
                                                    <td width="50%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; border: 1px solid #334155; margin-right: 8px;">
                                                        <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: 600;">Time</p>
                                                        <p style="color: #f8fafc; font-size: 16px; margin: 0; font-weight: 600;">${postTime}</p>
                                                    </td>
                                                    <td width="10"></td> <td width="50%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; border: 1px solid #334155;">
                                                        <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: 600;">Platform</p>
                                                        <p style="color: #818cf8; font-size: 16px; margin: 0; font-weight: 600;">${post.platform}</p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="color: #e2e8f0; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
                                                Post Content:
                                            </p>
                                            <div style="background-color: #0f172a; border-left: 4px solid #8b5cf6; padding: 20px; border-radius: 8px; color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                                                ${post.title}
                                            </div>

                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="https://ai-content-generator-blush-one.vercel.app/dashboard/calendar" 
                                                           style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center; box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);">
                                                            Post Now
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="background-color: #1e293b; padding: 24px; text-align: center; border-top: 1px solid #334155;">
                                            <p style="color: #64748b; font-size: 12px; margin: 0;">
                                                Sent by your AI Assistant
                                            </p>
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;

            // Send Email
            if (post.user_email) {
                await resend.emails.send({
                    from: 'ContentAI <onboarding@resend.dev>',
                    to: post.user_email,
                    subject: `⚡ Post Ready: ${post.title.substring(0, 30)}...`,
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