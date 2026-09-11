import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { isLockedOut, stateAfterFailure, stateAfterSuccess } from "@/lib/login-lockout";

// Account lockout: after MAX_ATTEMPTS consecutive failed logins, the admin
// account is locked for LOCK_DURATION_MS regardless of whether the correct
// password is supplied. This is the only login gate for the whole CMS and
// its email is published as the site's public contact address, so it needs
// protection against unlimited password guessing. Decision logic lives in
// src/lib/login-lockout.ts so it can be unit tested without a database.

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) return null;

        if (isLockedOut(admin)) return null;

        const valid = await bcrypt.compare(password, admin.password);

        if (!valid) {
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: stateAfterFailure(admin),
          });
          return null;
        }

        if (admin.failedAttempts > 0 || admin.lockedUntil) {
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: stateAfterSuccess(),
          });
        }

        return { id: admin.id, name: admin.name, email: admin.email };
      },
    }),
  ],
});
