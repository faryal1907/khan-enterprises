import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP configured: ${host}:${port}`);
    } else {
      this.logger.warn(
        "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS env vars missing). " +
        "Password reset emails will be logged to console only."
      );
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const subject = "Ali & Khan's Motorcycle Dealership - Password Reset";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #5E1414; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #5E1414; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password for your Ali & Khan's Motorcycle Dealership account.</p>
            <p>Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Alternatively, copy and paste this URL into your browser:</p>
            <p style="font-size: 12px; word-break: break-all; color: #666;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>Ali & Khan's Motorcycle Dealership</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Password Reset\n\nYou have requested to reset your password. Click the link below (valid for 1 hour):\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;

    await this.sendEmail({ to: email, subject, html, text });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    if (!this.transporter) {
      // SMTP not configured — log to console
      this.logger.log(`\n──────────────────────────────────────────────`);
      this.logger.log(`📧 EMAIL would be sent to: ${options.to}`);
      this.logger.log(`   Subject: ${options.subject}`);
      this.logger.log(`   Body preview: ${options.html.replace(/<[^>]*>/g, '').substring(0, 200)}...`);
      this.logger.log(`   (SMTP not configured — email was not sent)`);
      this.logger.log(`──────────────────────────────────────────────\n`);
      return;
    }

    const fromName = process.env.SMTP_FROM_NAME || "Ali & Khan's Motorcycle Dealership";
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "noreply@khan-enterprises.com";

    try {
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        html: options.html,
      });
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error}`);
      // Silently fail — don't block the password reset flow
    }
  }
}