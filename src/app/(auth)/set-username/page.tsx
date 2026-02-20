import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SetUsernameForm from "./set-username-form";

export default async function SetUsernamePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_complete) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 auth-page-background">
      <div className="w-full max-w-sm">
        <SetUsernameForm />
      </div>
    </div>
  );
}
