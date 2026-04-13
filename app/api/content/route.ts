import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Content file not found." }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("admin_auth")?.value;
  if (cookie !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json();
  fs.mkdirSync(path.dirname(CONTENT_PATH), { recursive: true });
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
