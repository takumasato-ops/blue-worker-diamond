import Link from "next/link";
import Nav from "@/components/Nav";

const CHALLENGES = [
  { icon: "&#9200;", title: "資格取得に時間がかかる", desc: "社員の自己学習に任せると、平均6-12ヶ月。業務と並行すると挫折率も高い。" },
  { icon: "&#128176;", title: "教育コストが高い", desc: "外部研修は1人あたり数十万円。社内講師の確保も困難。" },
  { icon: "&#128100;", title: "個別対応が難しい", desc: "社員ごとに知識レベルが異なるが、集合研修では画一的な指導しかできない。" },
  { icon: "&#128683;", title: "離職リスク", desc: "スキルアップの機会がない企業は社員の定着率が低い傾向にある。" },
];

const SOLUTIONS = [
  { icon: "&#9889;", title: "取得期間を最大50%短縮", desc: "AIが社員ごとの理解度を分析し、最適な学習プランを自動生成。弱点を重点的に補強。" },
  { icon: "&#128202;", title: "進捗をリアルタイム管理", desc: "管理ダッシュボードで全社員の学習状況を一元管理。遅れている社員には自動アラート。" },
  { icon: "&#129302;", title: "24時間AI家庭教師", desc: "社員はいつでもAIに質問可能。教育担当者の工数を大幅に削減。" },
  { icon: "&#128170;", title: "社員定着率の向上", desc: "資格取得支援による社員満足度UP。スキルアップの実感がモチベーションに直結。" },
];

const STATS = [
  { value: "50+", label: "導入企業", unit: "社" },
  { value: "3.2", label: "平均取得期間", unit: "ヶ月" },
  { value: "94", label: "社員満足度", unit: "%" },
  { value: "50", label: "学習時間削減", unit: "%" },
];

const FAQ = [
  { q: "導入にはどれくらいの期間がかかりますか？", a: "スタータープラン・プロプランはお申し込み当日から利用開始可能です。エンタープライズプランのカスタマイズには2-4週間程度いただく場合があります。" },
  { q: "既存の人事・研修システムと連携できますか？", a: "エンタープライズプランではAPI連携に対応しています。主要な人事管理システムとの実績がございますので、詳しくはお問い合わせください。" },
  { q: "社員が学習した内容の品質は保証されていますか？", a: "各資格の専門家が監修した教材を使用しています。AI生成コンテンツも定期的に品質チェックを行っています。" },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <div className="bg-accent2">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center text-white">
          <div className="inline-block bg-white/10 backdrop-blur text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10">
            For Enterprise
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-5">
            社員の資格取得を、<br />AIで効率化。
          </h1>
          <p className="text-white/70 text-[15px] leading-relaxed max-w-lg mx-auto mb-10">
            Blue Worker Diamondは、AI個別最適化学習で社員の資格取得期間を最大50%短縮。<br />
            管理ダッシュボードで進捗を一元管理し、教育コストを大幅に削減します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/advisor" className="bg-white text-accent2 font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/90 transition">
              導入相談する（無料）
            </Link>
            <Link href="/pricing" className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/10 transition">
              料金プランを見る
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-accent2">{s.value}<span className="text-sm font-normal text-sub ml-0.5">{s.unit}</span></div>
              <div className="text-sub text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-bg2">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Challenges</p>
            <h2 className="text-2xl font-bold text-accent2">こんな課題はありませんか？</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHALLENGES.map((c) => (
              <div key={c.title} className="card p-5 flex gap-4">
                <div className="text-2xl flex-shrink-0" dangerouslySetInnerHTML={{ __html: c.icon }} />
                <div>
                  <div className="font-bold text-sm text-accent2 mb-1">{c.title}</div>
                  <div className="text-xs text-sub leading-relaxed">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Solutions</p>
            <h2 className="text-2xl font-bold text-accent2">BWDが解決します</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOLUTIONS.map((s) => (
              <div key={s.title} className="card p-5 flex gap-4 border-accent/10">
                <div className="text-2xl flex-shrink-0" dangerouslySetInnerHTML={{ __html: s.icon }} />
                <div>
                  <div className="font-bold text-sm text-accent2 mb-1">{s.title}</div>
                  <div className="text-xs text-sub leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works for enterprise */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-2xl font-bold text-accent2">導入の流れ</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "01", title: "お問い合わせ", desc: "導入相談フォームからお気軽にご連絡ください" },
              { step: "02", title: "ヒアリング", desc: "御社の課題・目標をお伺いし、最適なプランをご提案" },
              { step: "03", title: "導入・設定", desc: "アカウント発行・社員登録。最短当日から利用開始" },
              { step: "04", title: "運用・改善", desc: "定期レポートとサポートで継続的な改善をサポート" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">{s.step}</div>
                <div className="font-bold text-sm text-accent2 mb-1">{s.title}</div>
                <div className="text-xs text-sub leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
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
      </div>

      {/* CTA */}
      <div className="bg-accent2">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">まずは無料でお試しください</h2>
          <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
            5名まで無料で利用できるスタータープランで、BWDの効果を実感してください。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/advisor" className="bg-white text-accent2 font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/90 transition">
              導入相談する（無料）
            </Link>
            <Link href="/pricing" className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/10 transition">
              料金プランを見る
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-light text-xs">
        Blue Worker Diamond
      </footer>
    </div>
  );
}
