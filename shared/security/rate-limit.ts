import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const isConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const limiters = {
  checkout: isConfigured
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(5, '1 m'), prefix: 'rl:checkout' })
    : null,

  lookup: isConfigured
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(20, '1 m'), prefix: 'rl:lookup' })
    : null,

  wallet: isConfigured
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'rl:wallet' })
    : null,

  general: isConfigured
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:api' })
    : null,
};

export type RateLimitTier = keyof typeof limiters;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

export async function checkRateLimit(
  req: NextRequest,
  tier: RateLimitTier = 'general'
): Promise<NextResponse | null> {
  const limiter = limiters[tier];
  if (!limiter) return null;

  const ip = getClientIp(req);
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Trop de requetes. Reessayez dans quelques instants.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}
