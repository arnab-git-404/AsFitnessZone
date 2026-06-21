import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@asfitnesszone.com';
const APP_NAME = 'As FitnessZone';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ---------- Welcome Email ----------

interface WelcomeEmailParams {
    name: string;
    email: string;
}

function buildWelcomeHtml({ name }: WelcomeEmailParams): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to ${APP_NAME}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f97316, #dc2626); padding:40px 24px; text-align:center;">
                            <h1 style="margin:0; font-size:28px; color:#ffffff; letter-spacing:-0.5px;">💪 Welcome to ${APP_NAME}</h1>
                            <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:15px;">Your fitness journey starts now!</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 24px;">
                            <p style="margin:0 0 16px; font-size:16px; color:#18181b;">Hi <strong>${name}</strong>,</p>
                            <p style="margin:0 0 16px; font-size:15px; color:#3f3f46; line-height:1.6;">
                                Thank you for joining <strong>${APP_NAME}</strong> — the best unisex gym in Bolpur! 
                                We're excited to have you on board.
                            </p>
                            <p style="margin:0 0 24px; font-size:15px; color:#3f3f46; line-height:1.6;">
                                Here's what you can do next:
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:10px 0;">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:28px; vertical-align:top; font-size:18px; color:#f97316;">✅</td>
                                                <td style="font-size:14px; color:#3f3f46; line-height:1.5;">
                                                    <strong>Complete your profile</strong> — Set your fitness goal, weight, and height to get personalized recommendations.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0;">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:28px; vertical-align:top; font-size:18px; color:#f97316;">✅</td>
                                                <td style="font-size:14px; color:#3f3f46; line-height:1.5;">
                                                    <strong>Check in daily</strong> — Track your attendance and build a streak. Consistency is key!
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0;">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:28px; vertical-align:top; font-size:18px; color:#f97316;">✅</td>
                                                <td style="font-size:14px; color:#3f3f46; line-height:1.5;">
                                                    <strong>Explore programs & trainers</strong> — Find the perfect workout plan and expert guidance.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${APP_URL}/user/dashboard"
                                           style="display:inline-block; padding:14px 36px; background:linear-gradient(135deg, #f97316, #dc2626); color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; border-radius:8px;">
                                            Go to Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#fafafa; padding:24px; text-align:center; border-top:1px solid #e4e4e7;">
                            <p style="margin:0 0 4px; font-size:13px; color:#71717a;">
                                ${APP_NAME} &bull; Bolpur, West Bengal
                            </p>
                            <p style="margin:0; font-size:12px; color:#a1a1aa;">
                                If you have any questions, reply to this email or visit our contact page.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function buildWelcomeText({ name }: WelcomeEmailParams): string {
    return `
Welcome to ${APP_NAME}, ${name}!

Thank you for joining ${APP_NAME} — the best unisex gym in Bolpur! We're excited to have you on board.

Here's what you can do next:

✅ Complete your profile — Set your fitness goal, weight, and height to get personalized recommendations.
✅ Check in daily — Track your attendance and build a streak. Consistency is key!
✅ Explore programs & trainers — Find the perfect workout plan and expert guidance.

Visit your dashboard: ${APP_URL}/user/dashboard

---
${APP_NAME} | Bolpur, West Bengal
    `.trim();
}

// ---------- Password Reset Email ----------

interface PasswordResetParams {
    name: string;
    email: string;
    token: string;
}

function buildPasswordResetHtml({ name, token }: PasswordResetParams): string {
    const resetUrl = `${APP_URL}/reset-password/${token}`;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your ${APP_NAME} Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #f97316, #dc2626); padding:40px 24px; text-align:center;">
                            <h1 style="margin:0; font-size:28px; color:#ffffff; letter-spacing:-0.5px;">🔑 Reset Your Password</h1>
                            <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:15px;">${APP_NAME}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 24px;">
                            <p style="margin:0 0 16px; font-size:16px; color:#18181b;">Hi <strong>${name}</strong>,</p>
                            <p style="margin:0 0 16px; font-size:15px; color:#3f3f46; line-height:1.6;">
                                We received a request to reset the password for your ${APP_NAME} account. 
                                Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}"
                                           style="display:inline-block; padding:14px 36px; background:linear-gradient(135deg, #f97316, #dc2626); color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; border-radius:8px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0 0 16px; font-size:14px; color:#71717a; line-height:1.6;">
                                Or copy this link into your browser:
                            </p>
                            <p style="margin:0 0 24px; font-size:13px; color:#f97316; word-break:break-all;">
                                ${resetUrl}
                            </p>
                            <p style="margin:0; font-size:14px; color:#a1a1aa; line-height:1.6;">
                                If you didn't request a password reset, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#fafafa; padding:24px; text-align:center; border-top:1px solid #e4e4e7;">
                            <p style="margin:0; font-size:13px; color:#71717a;">
                                ${APP_NAME} &bull; Bolpur, West Bengal
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function buildPasswordResetText({ name, token }: PasswordResetParams): string {
    const resetUrl = `${APP_URL}/reset-password/${token}`;
    return `
Reset Your ${APP_NAME} Password

Hi ${name},

We received a request to reset the password for your ${APP_NAME} account.
Click the link below to set a new password. This link is valid for 1 hour.

${resetUrl}

If you didn't request a password reset, you can safely ignore this email.

---
${APP_NAME} | Bolpur, West Bengal
    `.trim();
}

export async function sendPasswordResetEmail(params: PasswordResetParams): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  RESEND_API_KEY not set. Skipping password reset email for', params.email);
        return;
    }

    try {
        const { error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to: params.email,
            subject: `Reset your ${APP_NAME} password`,
            html: buildPasswordResetHtml(params),
            text: buildPasswordResetText(params),
        });

        if (error) {
            console.error('Resend password reset email error:', error);
        } else {
            console.log(`✅ Password reset email sent to ${params.email}`);
        }
    } catch (err) {
        console.error('Failed to send password reset email:', err);
    }
}

// ---------- Welcome Email ----------

export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  RESEND_API_KEY not set. Skipping welcome email for', params.email);
        return;
    }

    try {
        const { error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to: params.email,
            subject: `Welcome to ${APP_NAME}, ${params.name}! 💪`,
            html: buildWelcomeHtml(params),
            text: buildWelcomeText(params),
        });

        if (error) {
            console.error('Resend email error:', error);
        } else {
            console.log(`✅ Welcome email sent to ${params.email}`);
        }
    } catch (err) {
        console.error('Failed to send welcome email:', err);
    }
}
