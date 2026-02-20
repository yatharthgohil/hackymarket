"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/tv") return null;

  return (
    <footer className="w-full py-6 text-center text-xl font-bold text-white/80 font-[family-name:var(--font-gaegu)]">
      Made with love.
    </footer>
  );
}
