import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const baseUrl = new URL(request.url).origin;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const redirectPath = next.startsWith("/") ? next : `/${next}`;
    return NextResponse.redirect(`${baseUrl}${redirectPath}`);
  }

  const serviceClient = await createServiceClient();
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .single();

  if (profile && !profile.onboarding_complete) {
    return NextResponse.redirect(`${baseUrl}/set-username`);
  }

  const redirectPath = next.startsWith("/") ? next : `/${next}`;
  return NextResponse.redirect(`${baseUrl}${redirectPath}`);
}
