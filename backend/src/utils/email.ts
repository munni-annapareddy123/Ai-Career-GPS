import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string, type: 'verify' | 'reset'): Promise<void> {
  const subject = type === 'verify'
    ? 'CareerGPS AI - Verify Your Email'
    : 'CareerGPS AI - Reset Your Password';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; padding: 40px; border-radius: 16px; border: 1px solid #1f1f1f;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #fff; font-size: 28px; margin: 0;">CareerGPS AI</h1>
        <p style="color: #6366f1; font-size: 14px; margin: 5px 0 0;">Hallucination-Aware Career OS</p>
      </div>
      <div style="background: #1a1a1a; border-radius: 12px; padding: 30px; text-align: center; border: 1px solid #2a2a2a;">
        <h2 style="color: #fff; font-size: 20px; margin: 0 0 20px;">
          ${type === 'verify' ? 'Email Verification' : 'Password Reset'}
        </h2>
        <p style="color: #a0a0a0; font-size: 14px; margin: 0 0 20px;">
          ${type === 'verify'
            ? 'Thank you for registering. Use the following OTP to verify your email address.'
            : 'You requested a password reset. Use the following OTP to proceed.'}
        </p>
        <div style="background: #0a0a0a; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #2a2a2a;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${otp}</span>
        </div>
        <p style="color: #a0a0a0; font-size: 12px;">This OTP is valid for 10 minutes.</p>
      </div>
      <p style="color: #555; font-size: 12px; text-align: center; margin-top: 30px;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html,
  });
}
