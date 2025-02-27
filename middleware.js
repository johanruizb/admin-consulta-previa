import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const publicRoutes = ["/login"];

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isProtectedRoute = !isPublicRoute;

    const userCookies = await cookies();

    const session = await getIronSession(userCookies, {
        password: process.env.SESSION_SECRET,
        cookieName: "session",
    });

    if (isProtectedRoute && !session?.accessToken)
        return NextResponse.redirect(new URL("/login", req.nextUrl));

    if (isPublicRoute && session?.accessToken)
        return NextResponse.redirect(new URL("/", req.nextUrl));

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
