"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; special?: boolean }[] = [
  { href: "/about", label: "BWDとは" },
  { href: "/dashboard", label: "ステータス" },
  { href: "/learn", label: "修行" },
  { href: "/jobs", label: "転職ギルド" },
  { href: "/advisor", label: "キャリア相談", special: true },
  { href: "/admin", label: "王国管理" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="bg-bg2 border-b-2 border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-14">
        <Link href="/" className="text-base font-black tracking-wider text-accent2 mr-8" style={{ textShadow: "0 0 8px rgba(255,215,0,0.4)" }}>
          BWD
        </Link>
        <div className="flex gap-1 items-center">
          {links.map((l) =>
            l.special ? (
              <Link key={l.href} href={l.href}
                className="ml-1 px-4 py-1.5 rounded text-[13px] font-bold text-white border-2 border-accent"
                style={{ background: "linear-gradient(180deg, #e94560, #c0392b)", textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>
                {l.label}
              </Link>
            ) : (
              <Link key={l.href} href={l.href}
                className={`px-3 py-1.5 rounded text-[13px] font-medium transition ${
                  pathname === l.href
                    ? "bg-surface text-accent2 border border-accent2/30"
                    : "text-sub hover:text-accent2"
                }`}>
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
