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
            const emailContent = `
                <h1>Your Content is Ready!</h1>
                <p>You scheduled this for ${new Date(post.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}:</p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid orange;">
                  ${post.title}
                </blockquote>
                <p>Login to copy and post it now!</p>
            `;

            // Send Email
            if (post.user_email) {
                await resend.emails.send({
                    from: 'ContentAI <onboarding@resend.dev>',
                    to: post.user_email,
                    subject: `⏰ Time to post to ${post.platform}!`,
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