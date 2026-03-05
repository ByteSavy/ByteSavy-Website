import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@bytesavy.tech';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { firstName, lastName, email, phone, message } = body ?? {};

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Unknown';
    const subject = `New contact form submission from ${name}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        '[contact-api] RESEND_API_KEY is not set. Email will not be sent. Payload:',
        { name, email, phone, message }
      );
      return NextResponse.json({ ok: true, simulated: true }, { status: 200 });
    }

    const textLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      '',
      'Message:',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `ByteSavy Website <no-reply@bytesavy.tech>`,
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      text: textLines,
    });

    if (error) {
      console.error('[contact-api] Resend error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to send email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[contact-api] Unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}

