"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; special?: boolean }[] = [
  { href: "/about", label: "学校について" },
  { href: "/dashboard", label: "マイページ" },
  { href: "/learn", label: "授業" },
  { href: "/jobs", label: "学科一覧" },
  { href: "/pricing", label: "料金プラン" },
  { href: "/enterprise", label: "企業向け" },
  { href: "/advisor", label: "入学相談", special: true },
  { href: "/admin", label: "管理" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-14">
        <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
          <svg viewBox="0 0 28 32" width="22" height="26">
            <polygon points="14,2 26,14 14,26 2,14" fill="url(#navDiamond)" stroke="#635bff" strokeWidth="1.5" />
            <ellipse cx="14" cy="8" rx="8" ry="4" fill="#ff9f43" />
            <rect x="6" y="6" width="16" height="3" rx="1" fill="#ff9f43" />
            <line x1="7" y1="8" x2="21" y2="8" stroke="#e67e22" strokeWidth="1" />
            <ellipse cx="11" cy="14" rx="1.5" ry="1.5" fill="#0a2540" />
            <ellipse cx="17" cy="14" rx="1.5" ry="1.5" fill="#0a2540" />
            <circle cx="11.8" cy="13.3" r="0.6" fill="white" />
            <circle cx="17.8" cy="13.3" r="0.6" fill="white" />
            <path d="M 11 17.5 Q 14 20 17 17.5" fill="none" stroke="#0a2540" strokeWidth="1" strokeLinecap="round" />
            <defs><linearGradient id="navDiamond" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#635bff" /></linearGradient></defs>
          </svg>
          <span className="text-[13px] font-black tracking-tight text-accent2">Blue Worker Diamond</span>
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
