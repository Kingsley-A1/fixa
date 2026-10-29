import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspaceConfigured } from "@/lib/config";
const name = "fixa_session";
function key() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32)
    throw new Error("AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}
export async function setSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
  (await cookies()).set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
}
export async function currentUser() {
  if (!workspaceConfigured()) return null;
  const token = (await cookies()).get(name)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.uid !== "string") return null;
    return await db.user.findUnique({
      where: { id: payload.uid },
      select: {
        id: true,
        name: true,
        email: true,
        memberships: {
          select: {
            role: true,
            business: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  } catch {
    return null;
  }
}
export async function requireWorkspace() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const membership = user.memberships[0];
  if (!membership) redirect("/setup");
  return { user, business: membership.business, role: membership.role };
}
export async function clearSession() {
  (await cookies()).delete(name);
}
