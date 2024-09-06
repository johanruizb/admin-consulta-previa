"use server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const publicRoutes = ["/login"];

export default async function middleware(req) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isProtectedRoute = !isPublicRoute;

    // 3. Decrypt the session from the cookie
    const cookiesList = cookies();
    const session = cookiesList.get("session");

    console.log("cookiesList", cookiesList);
    console.log("session", session);

    // 5. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.value)
        return NextResponse.redirect(new URL("/login", req.nextUrl));

    // 6. Redirect to / if the user is authenticated
    if (
        isPublicRoute &&
        session?.value
        // && !path.startsWith("/")
    )
        return NextResponse.redirect(new URL("/", req.nextUrl));

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};