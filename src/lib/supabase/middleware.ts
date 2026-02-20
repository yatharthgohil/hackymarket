import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    return NextResponse.next({ request });
  }

  const method = request.method;
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    method !== "GET" &&
    method !== "HEAD" &&
    method !== "OPTIONS"
  ) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const isVercel = host?.includes("vercel.app") || host?.includes("vercel.com");

    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host && !isVercel) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } catch {
        if (!isVercel) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    } else {
      if (!isVercel) {
        const userAgent = request.headers.get("user-agent");
        if (userAgent && !userAgent.includes("curl") && !userAgent.includes("Postman")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const publicRoutes = [
      "/",
      "/login",
      "/set-username",
      "/leaderboard",
      "/markets",
      "/tv",
    ];
    const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));

    const protectedRoutes = ["/portfolio", "/admin"];
    const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));

    const isSetUsernamePage = pathname === "/set-username";
    const isSetUsernameApi = pathname === "/api/auth/set-username";

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const authPages = ["/login", "/set-username"];
    const isAuthPage = authPages.some((r) => pathname === r || pathname.startsWith(r + "/"));

    if (user && isAuthPage) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", user.id)
          .single();

        if (pathname === "/login" && profile?.onboarding_complete) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
        if (pathname === "/login" && profile && !profile.onboarding_complete) {
          const url = request.nextUrl.clone();
          url.pathname = "/set-username";
          return NextResponse.redirect(url);
        }
        if (pathname === "/set-username" && profile?.onboarding_complete) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
      } catch (error) {
        console.error("Middleware profile check:", error);
      }
    }

    if (user && !isSetUsernamePage && !isSetUsernameApi) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", user.id)
          .single();

        if (profile && !profile.onboarding_complete) {
          const url = request.nextUrl.clone();
          url.pathname = "/set-username";
          return NextResponse.redirect(url);
        }
      } catch (error) {
        console.error("Middleware onboarding check:", error);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next({ request });
  }
}
