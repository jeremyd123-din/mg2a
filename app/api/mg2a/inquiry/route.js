import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { Resend } from "resend";

export async function POST(request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 12000)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  let input;
  try {
    const raw = await request.text();
    if (raw.length > 12000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (input.website) return NextResponse.json({ success: true });
  const limits = { name: 150, email: 254, phone: 40, need: 150, details: 5000 };
  const data = {};
  for (const [name, max] of Object.entries(limits)) {
    if (input[name] != null && typeof input[name] !== "string")
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    data[name] = (input[name] || "").trim();
    if (data[name].length > max)
      return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }
  if (
    !data.name ||
    !data.details ||
    !data.need ||
    !/^\S+@\S+\.\S+$/.test(data.email) ||
    /[\r\n]/.test(data.email)
  )
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: "production",
      apiVersion: "2025-02-19",
      useCdn: false,
      token: process.env.SANITY_TOKEN,
      perspective: "published",
    });
    const settings = await client.fetch(
      '*[_id=="mg2a-settings"][0]{inquiryEmail}',
    );
    const recipient = settings?.inquiryEmail;
    if (!recipient || !process.env.RESEND_API_KEY)
      return NextResponse.json(
        { error: "Inquiry delivery is not configured. Please call an office." },
        { status: 503 },
      );
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from:
        process.env.MG2A_INQUIRY_FROM || "MG2A Inquiries <forms@janoova.com>",
      to: [recipient],
      replyTo: data.email,
      subject: "MG2A project inquiry",
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nI need help with: ${data.need}\n\nProject details:\n${data.details}`,
    });
    if (result.error) {
      console.error("MG2A inquiry delivery failed:", result.error.name);
      return NextResponse.json(
        { error: "Delivery failed. Please retry or call an office." },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MG2A inquiry unavailable:", error.name);
    return NextResponse.json(
      { error: "Unable to deliver inquiry." },
      { status: 503 },
    );
  }
}
