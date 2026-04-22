import Link from "next/link";
import Image from "next/image";

const COURSES = [
  { icon: "&#9889;", name: "電気工事学科", certs: "第二種・第一種電気工事士", color: "from-yellow-400 to-orange-500" },
  { icon: "&#127959;", name: "建設管理学科", certs: "2級・1級施工管理技士", color: "from-blue-400 to-indigo-500" },
  { icon: "&#128666;", name: "物流・運輸学科", certs: "フォークリフト・大型免許", color: "from-green-400 to-emerald-500" },
  { icon: "&#128293;", name: "安全管理学科", certs: "危険物乙4・衛生管理者", color: "from-red-400 to-pink-500" },
  { icon: "&#128295;", name: "設備メンテナンス学科", certs: "ボイラー・ビルメン4点", color: "from-purple-400 to-violet-500" },
  { icon: "&#9879;", name: "溶接・金属加工学科", certs: "アーク溶接・ガス溶接", color: "from-amber-400 to-orange-600" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-accent2">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-30" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-accent2/70 z-0" />
        <nav className="relative z-10 max-w-6xl mx-auto px-6 flex items-center h-16">
          <span className="text-white font-black text-base tracking-tight">Blue Worker Diamond</span>
          <div className="ml-auto flex gap-4 items-center text-[13px]">
            <Link href="/about" className="text-white/70 hover:text-white transition">学校について</Link>
            <Link href="/jobs" className="text-white/70 hover:text-white transition">学科一覧</Link>
            <Link href="/dashboard" className="bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-lg hover:bg-white/20 transition">マイページ</Link>
          </div>
        </nav>
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20 text-center text-white">
          <div className="inline-block bg-white/10 backdrop-blur text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10">
            入学金・授業料すべて無料
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-5">
            ブルーカラーの<br />すべての資格が取れる、<br />バーチャル学校。
          </h1>
          <p className="text-white/70 text-[15px] leading-relaxed max-w-lg mx-auto mb-10">
            Blue Worker Diamondは、AI専属家庭教師がつくオンライン学校です。<br />
            6つの学科で、あなたのペースで国家資格の取得を目指せます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jobs" className="bg-white text-accent2 font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/90 transition">
              学科一覧を見る
            </Link>
            <Link href="/advisor" className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/10 transition">
              入学相談をする
            </Link>
          </div>
        </div>
      </div>

      {/* Numbers */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "6", unit: "学科", label: "専門コース" },
            { value: "17+", unit: "", label: "取得可能資格" },
            { value: "0", unit: "円", label: "授業料" },
            { value: "24/7", unit: "", label: "AI家庭教師" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-accent2">{s.value}<span className="text-sm font-normal text-sub ml-0.5">{s.unit}</span></div>
              <div className="text-sub text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses (学科) */}
      <div className="bg-bg2">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Curriculum</p>
            <h2 className="text-2xl font-bold text-accent2">6つの学科</h2>
            <p className="text-sub text-sm mt-2">すべての学科を自由に受講できます</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURSES.map((c) => (
              <Link key={c.name} href="/jobs" className="card p-5 hover:border-accent transition group">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-lg mb-3`} dangerouslySetInnerHTML={{ __html: c.icon }} />
                <div className="font-bold text-[15px] text-accent2 mb-1 group-hover:text-accent transition">{c.name}</div>
                <div className="text-xs text-sub">{c.certs}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How it works - School style */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-2xl font-bold text-accent2">入学から卒業まで</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "01", title: "入学相談", desc: "AIアドバイザーがあなたに合った学科・資格を提案", icon: "&#128172;" },
              { step: "02", title: "学科を選択", desc: "17以上の資格から自由に選んで学習プランを作成", icon: "&#128218;" },
              { step: "03", title: "授業を受ける", desc: "動画授業＋AIテストで理解度を確認しながら進む", icon: "&#127891;" },
              { step: "04", title: "資格取得・卒業", desc: "国家資格を取得し、高年収キャリアへ", icon: "&#127942;" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-3xl mb-3" dangerouslySetInnerHTML={{ __html: s.icon }} />
                <div className="text-accent font-mono text-[11px] font-bold mb-1">STEP {s.step}</div>
                <div className="font-bold text-sm text-accent2 mb-1">{s.title}</div>
                <div className="text-xs text-sub leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features - School benefits */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">School Features</p>
            <h2 className="text-2xl font-bold text-accent2">BWDスクールの特徴</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "授業料完全無料", desc: "入学金・教材費・受講料すべて0円。企業提携モデルだから実現できました。" },
              { title: "AI専属家庭教師", desc: "24時間いつでも質問OK。あなたのペースに合わせた個別指導。" },
              { title: "好きな学科を自由選択", desc: "6学科すべてを同時に受講可能。複数資格の同時取得も目指せます。" },
              { title: "動画授業＋確認テスト", desc: "プロ講師の動画で学び、AIが理解度を毎回チェック。" },
              { title: "卒業後の就職サポート", desc: "資格取得後は提携企業への紹介まで一気通貫で支援。就職率94%。" },
              { title: "市場価値の可視化", desc: "学ぶほど推定年収が上がる。成長が数字で見えるからやる気が続く。" },
            ].map((f) => (
              <div key={f.title} className="card p-5">
                <div className="font-bold text-sm text-accent2 mb-1">{f.title}</div>
                <div className="text-xs text-sub leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students gallery */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Students</p>
            <h2 className="text-2xl font-bold text-accent2">在校生・卒業生の活躍</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { src: "/images/electrician.jpg", label: "電気工事学科 卒業" },
              { src: "/images/construction-mgr.jpeg", label: "建設管理学科 在籍" },
              { src: "/images/welding.jpeg", label: "溶接学科 卒業" },
              { src: "/images/boiler.jpeg", label: "設備メンテナンス学科 在籍" },
            ].map((p) => (
              <div key={p.label} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={p.src} alt={p.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-white text-[11px] font-medium">{p.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-accent2">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">まずは学校を覗いてみよう</h2>
          <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
            入学手続きは1分。学科を選んで、今日から授業を始められます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jobs" className="bg-white text-accent2 font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/90 transition">
              学科一覧を見る
            </Link>
            <Link href="/advisor" className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-[15px] hover:bg-white/10 transition">
              入学相談（無料）
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-sub">Blue Worker Diamond School</div>
          <div className="flex flex-wrap gap-4 text-xs text-sub">
            <Link href="/about" className="hover:text-text transition">学校について</Link>
            <Link href="/jobs" className="hover:text-text transition">学科一覧</Link>
            <Link href="/pricing" className="hover:text-text transition">料金プラン</Link>
            <Link href="/enterprise" className="hover:text-text transition">企業向け</Link>
            <Link href="/advisor" className="hover:text-text transition">入学相談</Link>
            <Link href="/dashboard" className="hover:text-text transition">マイページ</Link>
            <Link href="/terms" className="hover:text-text transition">利用規約</Link>
            <Link href="/privacy" className="hover:text-text transition">プライバシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
