import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const secretValue = process.env.JWT_SECRET;

if (!secretValue) {
  throw new Error("JWT_SECRET não definida no ambiente.");
}

const secret = new TextEncoder().encode(secretValue);
const INACTIVITY_LIMIT_SECONDS = 60 * 60 * 4;

type SessionPayload = {
  userId: string;
  email: string;
  role: "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";
  name: string;
  lastActivity: number;
  iat?: number;
  exp?: number;
};

function isProduction() {
  return process.env.NODE_ENV === "production";
}

async function signSessionToken(payload: SessionPayload) {
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    lastActivity: payload.lastActivity,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);
}

function clearStudioCookie(response: NextResponse) {
  response.cookies.set("studio_session", "", {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("studio_session")?.value;

  if (!pathname.startsWith("/studio")) {
    return NextResponse.next();
  }

  if (pathname === "/studio/login") {
    if (!token) {
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const session = payload as unknown as SessionPayload;

      const now = Math.floor(Date.now() / 1000);
      const inactiveFor = now - (session.lastActivity || 0);

      if (inactiveFor > INACTIVITY_LIMIT_SECONDS) {
        return clearStudioCookie(NextResponse.next());
      }

      return NextResponse.redirect(new URL("/studio/dashboard", request.url));
    } catch {
      return clearStudioCookie(NextResponse.next());
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const session = payload as unknown as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    const inactiveFor = now - (session.lastActivity || 0);

    if (inactiveFor > INACTIVITY_LIMIT_SECONDS) {
      return clearStudioCookie(
        NextResponse.redirect(new URL("/studio/login", request.url))
      );
    }

    const refreshedToken = await signSessionToken({
      userId: session.userId,
      email: session.email,
      role: session.role,
      name: session.name,
      lastActivity: now,
    });

    const response = NextResponse.next();

    response.cookies.set("studio_session", refreshedToken, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4,
    });

    return response;
  } catch {
    return clearStudioCookie(
      NextResponse.redirect(new URL("/studio/login", request.url))
    );
  }
}

export const config = {
  matcher: ["/studio/:path*"],
};