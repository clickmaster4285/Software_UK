import { NextRequest, NextResponse } from 'next/server';

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// ClickMasters Official Colors (OKLCH mapped to Hex for Email)
const BRAND_ACCENT = '#D4A017'; 
const BRAND_PRIMARY = '#1A2A3A';

const adminDetailRow = (label, value) => {
  const v = value?.trim();
  if (!v) return '';
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:600;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:15px;vertical-align:top;">${escapeHtml(v)}</td>
    </tr>`;
};

const adminEmailHtml = (f) => {
  const rows =
    adminDetailRow('Full name', f.name) +
    adminDetailRow('Email', f.email) +
    adminDetailRow('Phone', f.phone ?? '') +
    adminDetailRow('Company', f.company ?? '') +
    adminDetailRow('Service / source', f.services ?? '') +
    adminDetailRow('Budget', f.budget ?? '');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_ACCENT} 100%);padding:28px 32px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.9);">ClickMasters</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;font-family:Segoe UI,system-ui,sans-serif;line-height:1.3;">New inquiry from your website</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.92);font-family:Segoe UI,system-ui,sans-serif;line-height:1.5;">A lead submitted the contact form. Details are below.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;font-family:Segoe UI,system-ui,sans-serif;">Lead information</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                ${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;font-family:Segoe UI,system-ui,sans-serif;">Project message</p>
              <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;font-size:15px;line-height:1.65;color:#374151;font-family:Segoe UI,system-ui,sans-serif;white-space:pre-wrap;">${escapeHtml(f.message?.trim() || '')}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;font-family:Segoe UI,system-ui,sans-serif;">You can reply to this email to respond directly to <strong style="color:#111827;">${escapeHtml(f.name?.trim() || '')}</strong>.</p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;font-family:Segoe UI,system-ui,sans-serif;">This message was generated automatically from the ClickMasters contact system.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const autoReplyHtml = (name) => {
  const first = name?.trim().split(/\s+/)[0] || 'there';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_ACCENT} 100%);padding:24px 28px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;font-family:Segoe UI,system-ui,sans-serif;">Thank you for reaching out</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;font-family:Segoe UI,system-ui,sans-serif;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#111827;">Hi ${escapeHtml(first)},</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#4b5563;">We have received your message and appreciate you contacting <strong style="color:#111827;">ClickMasters</strong>. A member of our team will review your inquiry and respond as soon as possible.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#4b5563;">If your request is urgent, please call us using the numbers listed on our website.</p>
              <p style="margin:0;font-size:15px;line-height:1.65;color:#4b5563;">Best regards,<br/><strong style="color:#111827;">The ClickMasters Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;background-color:#fafafa;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;font-family:Segoe UI,system-ui,sans-serif;">This is an automated message confirming we received your inquiry.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export async function POST(req) {
  try {
    const nodemailer = (await import('nodemailer')).default;
    const body = await req.json();
    const { name, email, message, company, phone, services, budget } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const lead = {
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      company: company ? String(company).trim() : undefined,
      phone: phone ? String(phone).trim() : undefined,
      services: services ? String(services).trim() : undefined,
      budget: budget ? String(budget).trim() : undefined,
    };

    const adminMailOptions = {
      from: `"${process.env.ALIAS_NAME || 'ClickMasters'}" <${process.env.SMTP_MAIL}>`,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_MAIL,
      replyTo: email,
      subject: `New lead: ${lead.name} — ClickMasters`,
      html: adminEmailHtml(lead),
    };

    const userMailOptions = {
      from: `"${process.env.ALIAS_NAME || 'ClickMasters'}" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: 'Thank You for Contacting ClickMasters',
      html: autoReplyHtml(name),
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return NextResponse.json({ message: 'Email sent successfully', success: true });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send message', success: false }, { status: 500 });
  }
}
