import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretValue = process.env.JWT_SECRET;

if (!secretValue) {
  throw new Error("JWT_SECRET não definida no ambiente.");
}

const secret = new TextEncoder().encode(secretValue);

function isProduction() {
  return process.env.NODE_ENV === "production";
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
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/studio/dashboard", request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.set("studio_session", "", {
        httpOnly: true,
        secure: isProduction(),
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });
      return response;
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/studio/login", request.url));
    response.cookies.set("studio_session", "", {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
    return response;
  }
}

export const config = {
  matcher: ["/studio/:path*"],
};