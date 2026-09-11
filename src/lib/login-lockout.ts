// Pure account-lockout decision logic, kept separate from auth.ts so it can
// be unit tested without a database or bcrypt in the loop.
export const MAX_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000;

export type LockoutState = { failedAttempts: number; lockedUntil: Date | null };

export function isLockedOut(state: LockoutState, now = Date.now()): boolean {
  return !!state.lockedUntil && state.lockedUntil.getTime() > now;
}

export function stateAfterFailure(state: LockoutState, now = Date.now()): LockoutState {
  const attempts = state.failedAttempts + 1;
  const lockingOut = attempts >= MAX_ATTEMPTS;
  return {
    failedAttempts: lockingOut ? 0 : attempts,
    lockedUntil: lockingOut ? new Date(now + LOCK_DURATION_MS) : null,
  };
}

export function stateAfterSuccess(): LockoutState {
  return { failedAttempts: 0, lockedUntil: null };
}
