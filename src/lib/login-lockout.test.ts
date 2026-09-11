import { describe, it, expect } from "vitest";
import { isLockedOut, stateAfterFailure, stateAfterSuccess, MAX_ATTEMPTS } from "./login-lockout";

describe("isLockedOut", () => {
  it("is false with no lockout set", () => {
    expect(isLockedOut({ failedAttempts: 0, lockedUntil: null })).toBe(false);
  });

  it("is true while lockedUntil is in the future", () => {
    const now = Date.now();
    expect(isLockedOut({ failedAttempts: 0, lockedUntil: new Date(now + 60_000) }, now)).toBe(true);
  });

  it("is false once lockedUntil has passed", () => {
    const now = Date.now();
    expect(isLockedOut({ failedAttempts: 0, lockedUntil: new Date(now - 1) }, now)).toBe(false);
  });
});

describe("stateAfterFailure", () => {
  it("increments failedAttempts below the threshold", () => {
    const next = stateAfterFailure({ failedAttempts: 1, lockedUntil: null });
    expect(next).toEqual({ failedAttempts: 2, lockedUntil: null });
  });

  it("locks the account and resets the counter once MAX_ATTEMPTS is reached", () => {
    const now = Date.now();
    const next = stateAfterFailure({ failedAttempts: MAX_ATTEMPTS - 1, lockedUntil: null }, now);
    expect(next.failedAttempts).toBe(0);
    expect(next.lockedUntil).not.toBeNull();
    expect(next.lockedUntil!.getTime()).toBeGreaterThan(now);
  });
});

describe("stateAfterSuccess", () => {
  it("clears attempts and lockout", () => {
    expect(stateAfterSuccess()).toEqual({ failedAttempts: 0, lockedUntil: null });
  });
});
