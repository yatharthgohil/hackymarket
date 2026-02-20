import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { username: raw } = body;

  if (!raw || typeof raw !== "string") {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const username = raw.trim();

  if (username.length < 2 || username.length > 30) {
    return NextResponse.json(
      { error: "Username must be 2–30 characters" },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, and underscores" },
      { status: 400 }
    );
  }

  const serviceClient = await createServiceClient();

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.onboarding_complete) {
    return NextResponse.json(
      { error: "Username already set" },
      { status: 400 }
    );
  }

  const { data: existing } = await serviceClient
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Username is already taken" },
      { status: 400 }
    );
  }

  const { error: updateError } = await serviceClient
    .from("profiles")
    .update({ username, onboarding_complete: true })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to save username" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
