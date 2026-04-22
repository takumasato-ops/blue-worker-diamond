import Link from "next/link";
import Nav from "@/components/Nav";

const PLANS = [
  {
    name: "スターター",
    price: "0",
    unit: "円/月",
    desc: "まずは試してみたい企業様に",
    highlight: false,
    features: [
      "5名まで利用可能",
      "基本学習機能（動画・AI クイズ）",
      "6学科の教材アクセス",
      "メールサポート",
    ],
    disabled: [
      "管理ダッシュボード",
      "進捗レポート",
      "カスタムカリキュラム",
      "優先サポート",
    ],
    cta: "無料で始める",
    href: "/advisor",
  },
  {
    name: "プロ",
    price: "29,800",
    unit: "円/月（税込）",
    desc: "社員教育を本格的にDX化したい企業様に",
    highlight: true,
    features: [
      "50名まで利用可能",
      "全学習機能（動画・AI クイズ・家庭教師）",
      "管理ダッシュボード",
      "社員ごとの進捗レポート",
      "弱点分析・適応型学習",
      "優先メール・チャットサポート",
      "月次レポート自動送付",
    ],
    disabled: [
      "カスタムカリキュラム",
      "API連携",
    ],
    cta: "プロプランを始める",
    href: "/advisor",
  },
  {
    name: "エンタープライズ",
    price: "要お問い合わせ",
    unit: "",
    desc: "大規模導入・カスタマイズが必要な企業様に",
    highlight: false,
    features: [
      "利用人数 無制限",
      "全機能アクセス",
      "専任カスタマーサクセス担当",
      "カスタムカリキュラム作成",
      "API連携（人事システム等）",
      "SLA保証（稼働率99.9%）",
      "オンボーディング支援",
      "請求書払い対応",
    ],
    disabled: [],
    cta: "導入相談する",
    href: "/advisor",
  },
];

const FAQ = [
  { q: "無料プランから有料プランへの切り替えはスムーズにできますか？", a: "はい、管理画面からワンクリックでアップグレードできます。学習データはすべて引き継がれます。" },
  { q: "契約期間の縛りはありますか？", a: "月額プランは1ヶ月単位でいつでも解約可能です。年間プランをご希望の場合は、2ヶ月分お得になる年額プランもご用意しています。" },
  { q: "社員が退職した場合、アカウントはどうなりますか？", a: "管理ダッシュボードからアカウントの無効化が可能です。利用枠は他の社員に再割り当てできます。" },
  { q: "導入前にデモを見ることはできますか？", a: "はい、オンラインデモを随時実施しています。お気軽にお問い合わせください。" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Pricing</p>
          <h1 className="text-2xl sm:text-3xl font-black text-accent2 mb-3">シンプルで透明な料金プラン</h1>
          <p className="text-sub text-sm max-w-lg mx-auto">企業規模に合わせて選べる3つのプラン。すべてのプランで基本的な学習機能をご利用いただけます。</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`card p-6 flex flex-col ${plan.highlight ? "border-accent ring-2 ring-accent/20 relative" : ""}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[11px] font-bold px-4 py-1 rounded-full">
                  おすすめ
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-lg text-accent2">{plan.name}</h3>
                <p className="text-xs text-sub mt-1">{plan.desc}</p>
              </div>
              <div className="mb-5">
                <span className="text-3xl font-black text-accent2">{plan.price}</span>
                <span className="text-xs text-sub ml-1">{plan.unit}</span>
              </div>
              <div className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex gap-2 text-sm">
                    <span className="text-green flex-shrink-0">&#10003;</span>
                    <span className="text-sub">{f}</span>
                  </div>
                ))}
                {plan.disabled.map((f) => (
                  <div key={f} className="flex gap-2 text-sm">
                    <span className="text-light flex-shrink-0">&#10005;</span>
                    <span className="text-light">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-lg text-sm font-bold transition ${plan.highlight ? "bg-accent text-white hover:bg-accent/90" : "bg-bg2 text-accent2 hover:bg-accent/10 border border-border"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-accent2 text-center mb-8">よくある質問</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="card p-5">
                <h3 className="font-bold text-sm text-accent2 mb-2">{f.q}</h3>
                <p className="text-sub text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-xl font-bold text-accent2 mb-3">ご不明な点はお気軽にご相談ください</h2>
          <p className="text-sub text-sm mb-6">専任スタッフが最適なプランをご提案します</p>
          <Link href="/advisor" className="btn-primary inline-block px-8 py-3 text-sm">導入相談する（無料）</Link>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-light text-xs mt-8">
        Blue Worker Diamond
      </footer>
    </div>
  );
}
