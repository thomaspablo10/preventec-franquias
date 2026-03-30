import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionPayload = {
  userId: string;
  email: string;
  role: "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";
  name: string;
  lastActivity: number;
};

const secretValue = process.env.JWT_SECRET;

if (!secretValue) {
  throw new Error("JWT_SECRET não definida no .env.local");
}

const secret = new TextEncoder().encode(secretValue);

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export async function createSessionToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionPayload;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("studio_session", token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set("studio_session", "", {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("studio_session")?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    cookieStore.set("studio_session", "", {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return null;
  }
}