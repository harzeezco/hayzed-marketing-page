import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type BuyerSubmission = {
  kind: 'buyer';
  name: string;
  email: string;
  phone: string;
  location: string;
  product: string;
  challenge: string;
  consent: true;
  consentVersion: '2026-10-v1';
};

function webhookUrl(): URL | null {
  try {
    const url = new URL(process.env.GOOGLE_SHEETS_WEB_APP_URL || '');
    return url.protocol === 'https:' &&
      url.hostname === 'script.google.com' &&
      /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname) ? url : null;
  } catch {
    return null;
  }
}

const ready = () => Boolean(webhookUrl() && process.env.GOOGLE_SHEETS_SHARED_SECRET);

function field(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text.length > 0 && text.length <= max ? text : null;
}

function parseBuyer(input: unknown): BuyerSubmission | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Record<string, unknown>;
  const name = field(record.name, 180);
  const email = field(record.email, 180);
  const phone = field(record.phone, 24);
  const location = field(record.location, 180);
  const product = field(record.product, 180);
  const challenge = record.challenge === undefined || record.challenge === ''
    ? ''
    : field(record.challenge, 2000);
  if (
    record.kind !== 'buyer' || record.consent !== true ||
    record.consentVersion !== '2026-10-v1' ||
    !name || !email || !phone || !location || !product || challenge === null ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^[+0-9 ()-]{7,24}$/.test(phone)
  ) return null;
  return { kind: 'buyer', name, email, phone, location, product, challenge, consent: true, consentVersion: '2026-10-v1' };
}

async function receiverReachable(): Promise<boolean> {
  const endpoint = webhookUrl();
  if (!endpoint || !ready()) return false;
  try {
    // A deliberately invalid request must reach doPost and return its JSON rejection.
    // It never writes a row, and prevents the form opening on a sign-in-only deployment.
    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'health' }),
      signal: AbortSignal.timeout(8_000),
      cache: 'no-store',
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return Boolean(result && typeof result === 'object' && (result as { ok?: unknown }).ok === false);
  } catch {
    return false;
  }
}

export async function GET() {
  return NextResponse.json({ ready: await receiverReachable() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return NextResponse.json({ error: 'Expected JSON.' }, { status: 415 });
  }

  const origin = request.headers.get('origin');
  if (origin) {
    let sameHost = false;
    try {
      // Next may use an internal hostname in request.url, even when the browser
      // and Host header use 127.0.0.1 or a public domain.
      sameHost = new URL(origin).host.toLowerCase() === request.headers.get('host')?.toLowerCase();
    } catch {
      // Reject malformed Origin headers.
    }
    if (!sameHost) return NextResponse.json({ error: 'This request is not allowed.' }, { status: 403 });
  }

  let data: BuyerSubmission | null = null;
  try {
    const body = await request.text();
    if (body.length > 10_000) return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    data = parseBuyer(JSON.parse(body));
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (!data) return NextResponse.json({ error: 'Please check your details and consent.' }, { status: 400 });
  if (!ready()) return NextResponse.json({ error: 'Signups are not connected yet.' }, { status: 503 });

  const endpoint = webhookUrl();
  if (!endpoint) return NextResponse.json({ error: 'Signup configuration is invalid.' }, { status: 503 });

  try {
    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        // Apps Script appendRow parses phone-like strings as numbers unless forced to text.
        phone: "'" + data.phone,
        secret: process.env.GOOGLE_SHEETS_SHARED_SECRET,
        submittedAt: new Date().toISOString(),
        source: 'hayzed-landing',
      }),
      signal: AbortSignal.timeout(25_000),
      cache: 'no-store',
    });
    const result: unknown = await response.json();
    if (!response.ok || !result || typeof result !== 'object' || (result as { ok?: unknown }).ok !== true) {
      throw new Error('Spreadsheet did not confirm the save.');
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'We could not save your details. Please try again.' }, { status: 502 });
  }
}

