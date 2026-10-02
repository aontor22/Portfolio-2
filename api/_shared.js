const minuteBuckets = globalThis.__portfolioMinuteBuckets ?? new Map();
const dayBuckets = globalThis.__portfolioDayBuckets ?? new Map();
globalThis.__portfolioMinuteBuckets = minuteBuckets;
globalThis.__portfolioDayBuckets = dayBuckets;

export function securityHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
    ...extra,
  };
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: securityHeaders(extraHeaders),
  });
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown').trim();
}

export function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function consume(map, key, limit, windowMs) {
  const now = Date.now();
  const current = map.get(key);
  if (!current || current.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (current.count >= limit) {
    return { ok: false, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  return { ok: true, remaining: limit - current.count, resetAt: current.resetAt };
}

export function enforceRateLimit(request, { perMinute = 10, perDay = 100 } = {}) {
  const ip = getClientIp(request);
  const min = consume(minuteBuckets, `m:${ip}`, perMinute, 60_000);
  if (!min.ok) return { ok: false, retryAfter: Math.ceil((min.resetAt - Date.now()) / 1000) };
  const day = consume(dayBuckets, `d:${ip}`, perDay, 86_400_000);
  if (!day.ok) return { ok: false, retryAfter: Math.ceil((day.resetAt - Date.now()) / 1000) };
  return { ok: true, remainingMinute: min.remaining, remainingDay: day.remaining };
}

export async function readJsonBody(request, maxBytes = 20_000) {
  const length = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(length) && length > maxBytes) {
    throw Object.assign(new Error('Request body too large'), { status: 413 });
  }
  const raw = await request.text();
  if (raw.length > maxBytes) {
    throw Object.assign(new Error('Request body too large'), { status: 413 });
  }
  try {
    return JSON.parse(raw || '{}');
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { status: 400 });
  }
}
