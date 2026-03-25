"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; special?: boolean }[] = [
  { href: "/about", label: "BWDとは" },
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/learn", label: "学習" },
  { href: "/jobs", label: "業種一覧" },
  { href: "/advisor", label: "キャリア相談", special: true },
  { href: "/admin", label: "管理" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-14">
        <Link href="/dashboard" className="text-base font-black tracking-tight text-accent mr-10">
          BWD
        </Link>
        <div className="flex gap-1 items-center">
          {links.map((l) =>
            l.special ? (
              <Link
                key={l.href}
                href={l.href}
                className="ml-1 px-4 py-1.5 rounded-full text-[13px] font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #a78bfa, #818cf8, #7dd3fc)" }}
              >
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition ${
                  pathname === l.href
                    ? "bg-accent/8 text-accent"
                    : "text-sub hover:text-text hover:bg-bg2"
                }`}
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
