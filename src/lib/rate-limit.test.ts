import { describe, it, expect, vi, afterEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, { limit: 3, windowMs: 1000 }).allowed).toBe(true);
    }
  });

  it("blocks once the limit is exceeded within the window", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, { limit: 2, windowMs: 1000 });
    checkRateLimit(key, { limit: 2, windowMs: 1000 });
    const third = checkRateLimit(key, { limit: 2, windowMs: 1000 });
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    vi.useFakeTimers();
    const key = `test-${Math.random()}`;
    checkRateLimit(key, { limit: 1, windowMs: 1000 });
    expect(checkRateLimit(key, { limit: 1, windowMs: 1000 }).allowed).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(checkRateLimit(key, { limit: 1, windowMs: 1000 }).allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    checkRateLimit(keyA, { limit: 1, windowMs: 1000 });
    expect(checkRateLimit(keyA, { limit: 1, windowMs: 1000 }).allowed).toBe(false);
    expect(checkRateLimit(keyB, { limit: 1, windowMs: 1000 }).allowed).toBe(true);
  });
});
