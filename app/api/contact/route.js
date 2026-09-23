import { NextResponse } from 'next/server';

const ERP_ENDPOINT = 'https://apierp.clickmasters.pk/public/web-leads';
const WEBSITE = 'clickmasterssoftwaredevelopmentcompany.co.uk';
const ALLOWED_SERVICES = new Set([
  'Software Development',
  'Web Development',
  'Mobile App Development',
  'Artificial Intelligence',
  'Blockchain',
  'Digital Marketing',
  'Automation',
]);

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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
    adminDetailRow('Service / source', f.service ?? '') +
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
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.9);">Clickmasters</p>
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
        <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;font-family:Segoe UI,system-ui,sans-serif;">This message was generated automatically from the Clickmasters contact system.</p>
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
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#4b5563;">We have received your message and appreciate you contacting <strong style="color:#111827;">Clickmasters</strong>. A member of our team will review your inquiry and respond as soon as possible.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#4b5563;">If your request is urgent, please call us using the numbers listed on our website.</p>
              <p style="margin:0;font-size:15px;line-height:1.65;color:#4b5563;">Best regards,<br/><strong style="color:#111827;">The Clickmasters Team</strong></p>
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

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

async function sendLeadEmails(lead) {
  const nodemailer = (await import('nodemailer')).default;
  const smtpPass = String(process.env.SMTP_PASSWORD || '').replace(/\s+/g, '');
  if (!process.env.SMTP_MAIL || !smtpPass) {
    throw new Error('SMTP_MAIL or SMTP_PASSWORD is not set');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: smtpPass,
    },
  });

  const from = `"${process.env.ALIAS_NAME || 'Clickmasters'}" <${process.env.SMTP_MAIL}>`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_MAIL,
      replyTo: lead.email,
      subject: `New lead: ${lead.name} — Clickmasters`,
      html: adminEmailHtml(lead),
    }),
    transporter.sendMail({
      from,
      to: lead.email,
      subject: 'Thank You for Contacting Clickmasters',
      html: autoReplyHtml(lead.name),
    }),
  ]);
}

export async function POST(req) {
  try {
    const websiteKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!websiteKey) {
      console.error('ERP API_KEY is not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = clean(body.name);
    const email = clean(body.email);
    const message = clean(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = clean(body.service);
    const payload = {
      name,
      email,
      message,
      phone: clean(body.phone),
      company: clean(body.company),
      website: WEBSITE,
      landingPage: clean(body.landingPage),
      referrer: clean(body.referrer),
      source: clean(body.source) || 'contact-page',
      utm_source: clean(body.utm_source),
      utm_medium: clean(body.utm_medium),
      utm_campaign: clean(body.utm_campaign),
      utm_term: clean(body.utm_term),
      utm_content: clean(body.utm_content),
    };

    if (service && ALLOWED_SERVICES.has(service)) {
      payload.service = service;
    }

    const res = await fetch(ERP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Website-Key': websiteKey,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('ERP lead error:', res.status, data.message || data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to submit lead' },
        { status: res.status }
      );
    }

    try {
      await sendLeadEmails({
        name,
        email,
        message,
        phone: payload.phone,
        company: payload.company,
        service: payload.service,
        budget: clean(body.budget),
      });
    } catch (emailError) {
      console.error('Lead email error (ERP already saved):', emailError);
    }

    return NextResponse.json(
      { success: true, data: data.data || data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact lead error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}
