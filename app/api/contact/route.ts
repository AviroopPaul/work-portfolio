import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { message, from } = await req.json();

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    subject: "New message from your portfolio",
    text: from ? `From: ${from}\n\n${message}` : message,
    html: from
      ? `<p><strong>From:</strong> ${from}</p><p>${message.replace(/\n/g, "<br>")}</p>`
      : `<p>${message.replace(/\n/g, "<br>")}</p>`,
  });

  return NextResponse.json({ ok: true });
}
