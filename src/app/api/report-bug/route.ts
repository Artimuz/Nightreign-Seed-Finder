import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-static"
import { supabase } from "@/lib/supabaseClient"
import { checkRateLimit } from "@/lib/rateLimit"

function toClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || null
  return ip
}

function sanitize(input: string, max: number): string {
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, max).trim()
  return cleaned
}

function isValidEmail(email: string): boolean {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return re.test(email)
}

function detectSuspicion(message: string, name: string, email: string, subject: string): boolean {
  const lower = `${name} ${email} ${subject} ${message}`.toLowerCase()
  const urlCount = (lower.match(/https?:\/\//g) || []).length
  const hasSpamWords = /(Danonangus|PoVoCumeAbobraComLeite)/i.test(lower)
  const repeatedChar = /(.)\1{10,}/.test(lower)
  return urlCount > 3 || hasSpamWords || repeatedChar
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentType = req.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "invalid_content_type" }, { status: 415 })
  }

  if (!checkRateLimit(req, 30000, 1)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  let bodyText: string
  try {
    bodyText = await req.text()
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }

  if (bodyText.length > 32 * 1024) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  let data: unknown
  try {
    data = JSON.parse(bodyText)
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  if (typeof data !== "object" || data === null) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 })
  }

  const payload = data as Record<string, unknown>
  const rawName = typeof payload.name === "string" ? payload.name : ""
  const rawEmail = typeof payload.email === "string" ? payload.email : ""
  const rawSubject = typeof payload.subject === "string" ? payload.subject : ""
  const rawMessage = typeof payload.message === "string" ? payload.message : ""
  const rawUserUrl = typeof payload.userUrl === "string" ? payload.userUrl : ""

  const name = sanitize(rawName, 50)
  const email = sanitize(rawEmail, 50)
  const subject = sanitize(rawSubject, 100)
  const message = sanitize(rawMessage, 1000)
  const userUrl = sanitize(rawUserUrl, 2048)

  if (!message || message.length < 1 || message.length > 1000) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 })
  }
  if (email && (!isValidEmail(email) || email.length > 50)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }
  if (name.length > 50 || subject.length > 100 || userUrl.length > 2048) {
    return NextResponse.json({ error: "invalid_limits" }, { status: 400 })
  }

  const isSuspected = detectSuspicion(message, name, email, subject)
  const userAgent = req.headers.get("user-agent") || null
  const clientIp = toClientIp(req)

  const insertData = {
    name: name || null,
    email: email || null,
    subject: subject || null,
    message,
    user_url: userUrl || null,
    user_agent: userAgent,
    client_ip: clientIp,
    is_suspected: isSuspected,
  } as Record<string, unknown>

  const { data: _data, error } = await (supabase as { from: (t: string) => { insert: (d: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }> } }).from("bug_reports").insert(insertData)

  if (error) {
    return NextResponse.json({ error: "storage_error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
