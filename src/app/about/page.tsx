import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";

const GRADUATES = [
  { name: "田中 美咲", age: 28, before: "営業事務 / 年収320万円", after: "第二種電気工事士 / 年収480万円", months: 3, message: "まさか自分が電気工事士になるとは思わなかった。毎日が充実しています。", image: "/images/graduate1.avif" },
  { name: "鈴木 花子", age: 34, before: "コールセンター / 年収280万円", after: "2級施工管理技士 / 年収520万円", months: 5, message: "デスクワークの経験が施工管理で意外と活きている。年収はほぼ倍になりました。", image: "/images/graduate2.avif" },
  { name: "山田 翔太", age: 41, before: "小売店長 / 年収350万円", after: "フォークリフト＋危険物乙4 / 年収430万円", months: 2, message: "40代でも遅くなかった。資格があるだけで面接の反応が全然違う。", image: "/images/graduate3.avif" },
  { name: "佐々木 裕也", age: 33, before: "一般事務 / 年収300万円", after: "ボイラー2級＋電工2種 / 年収450万円", months: 4, message: "ビルメンに転職して残業がほぼゼロに。家族との時間が増えました。", image: "/images/graduate4.avif" },
];

const HERO_IMAGES = [
  { src: "/images/electrician.jpg", alt: "笑顔で働く技術者" },
  { src: "/images/construction-mgr.jpeg", alt: "電気工事の現場" },
  { src: "/images/crane.jpg", alt: "建設現場で活躍する人" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero with image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero.jpeg" alt="Working professionals" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-14 flex items-center gap-10">
          <div className="flex-1">
            <div className="inline-block bg-accent/8 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-5">
              About BWD School
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-accent2 mb-4">
              すべてのブルーカラー資格が、<br />無料で取れる学校。
            </h1>
            <p className="text-sub text-[15px] leading-relaxed max-w-lg">
              Blue Worker Diamond Schoolは、AI専属家庭教師がつくバーチャル学校です。6つの学科で17以上の国家資格取得を目指せます。授業料は完全無料。
            </p>
          </div>
        </div>
      </div>

      {/* Photo gallery strip */}
      <div className="bg-bg2 border-y border-border py-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-3 rounded-xl overflow-hidden">
            {HERO_IMAGES.map((img) => (
              <div key={img.alt} className="relative h-40 sm:h-52">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-sub mt-3">BWDの卒業生たちは、全国の現場で活躍しています</p>
        </div>
      </div>

      {/* What is BWD - with images */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-center text-accent2 mb-10">BWDとは</h2>
        <div className="space-y-8">
          {[
            { num: "01", title: "AIが最適な資格を提案", desc: "あなたの経験・希望年収・適性をAIが分析し、最も市場価値の高い資格を選定。迷わず最短ルートで学習を開始できます。", image: "/images/construction-mgr.jpeg", caption: "AIキャリア相談画面" },
            { num: "02", title: "動画学習＋理解度チェック", desc: "厳選された解説動画で学び、AIが理解度を確認。わからない部分は24時間いつでもAI家庭教師に質問できます。", image: "/images/electrician.jpg", caption: "動画学習＋AIテスト画面" },
            { num: "03", title: "市場価値を可視化", desc: "学習の進捗に応じて推定年収がリアルタイムで変動。自分の成長が数字で見えるから、モチベーションが続きます。", image: "/images/boiler.jpeg", caption: "ダッシュボード画面" },
          ].map((f, i) => (
            <div key={f.num} className={`flex flex-col sm:flex-row gap-6 items-center ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
              <div className="sm:w-1/2 relative h-52 w-full rounded-xl overflow-hidden">
                <Image src={f.image} alt={f.title} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="sm:w-1/2">
                <div className="text-accent font-mono text-xs font-bold mb-2">{f.num}</div>
                <h3 className="font-bold text-lg text-accent2 mb-2">{f.title}</h3>
                <p className="text-sub text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why BWD - Value */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-xl font-bold text-center text-accent2 mb-3">なぜBWDなのか</h2>
          <p className="text-sub text-sm text-center mb-10">他の学習サービスにはない、BWDだけの価値</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "完全無料で利用可能", desc: "企業が導入費用を負担するため、求職者の費用負担はゼロ。" },
              { title: "未経験からでも大丈夫", desc: "受講者の87%が業界未経験者。AIがレベルに合わせた学習プランを作成。" },
              { title: "平均3.2ヶ月で資格取得", desc: "AI最適化カリキュラムで大幅に短縮。最短記録は45日。" },
              { title: "転職まで一気通貫サポート", desc: "資格取得から提携企業への紹介まで。取得後の就職率は94%。" },
              { title: "挫折させない仕組み", desc: "進捗の可視化、AIからの応援メッセージで続けられる。" },
              { title: "年収アップの実績", desc: "卒業生の平均年収アップ額は+152万円。" },
            ].map((v) => (
              <div key={v.title} className="flex gap-3 p-4 card">
                <span className="text-green mt-0.5 flex-shrink-0">&#10003;</span>
                <div>
                  <div className="font-bold text-sm text-accent2 mb-0.5">{v.title}</div>
                  <div className="text-sub text-[13px] leading-relaxed">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Numbers */}
      <div className="max-w-4xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {[
          { value: "94%", label: "就職成功率" },
          { value: "+152万", label: "平均年収UP" },
          { value: "3.2ヶ月", label: "平均取得期間" },
          { value: "87%", label: "未経験者の割合" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-accent2 stat-value">{s.value}</div>
            <div className="text-sub text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Working people photo section */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-xl font-bold text-center text-accent2 mb-8">輝く現場の人たち</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { src: "/images/construction-mgr.jpeg", label: "電気工事士" },
              { src: "/images/crane.jpg", label: "施工管理" },
              { src: "/images/welding.jpeg", label: "溶接工" },
              { src: "/images/boiler.jpeg", label: "設備技術者" },
            ].map((p) => (
              <div key={p.label} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={p.src} alt={p.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-white text-xs font-medium">{p.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graduates with photos */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-center text-accent2 mb-3">卒業生の声</h2>
        <p className="text-sub text-sm text-center mb-10">BWDでキャリアを変えた方々のリアルなストーリー</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GRADUATES.map((g) => (
            <div key={g.name} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={g.image} alt={g.name} fill className="object-cover object-top" sizes="48px" />
                </div>
                <div>
                  <div className="font-bold text-sm">{g.name}さん（{g.age}歳）</div>
                  <div className="text-xs text-sub">取得期間: {g.months}ヶ月</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm">
                <div className="flex-1 bg-bg2 rounded-lg p-3 text-center">
                  <div className="text-xs text-sub mb-0.5">Before</div>
                  <div className="font-medium text-xs">{g.before}</div>
                </div>
                <span className="text-accent font-bold">&#8594;</span>
                <div className="flex-1 bg-accent/5 border border-accent/15 rounded-lg p-3 text-center">
                  <div className="text-xs text-accent mb-0.5">After</div>
                  <div className="font-medium text-xs">{g.after}</div>
                </div>
              </div>
              <p className="text-sub text-[13px] leading-relaxed italic">&ldquo;{g.message}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* App screenshots section */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-xl font-bold text-center text-accent2 mb-3">アプリの画面イメージ</h2>
          <p className="text-sub text-sm text-center mb-10">BWDを使った学習の流れをご紹介します</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { title: "ダッシュボード", desc: "進捗・市場価値・正答率がひと目でわかる", path: "/dashboard", image: "/images/boiler.jpeg" },
              { title: "動画学習", desc: "資格に合わせた動画＋AIクイズ", path: "/learn", image: "/images/electrician.jpg" },
              { title: "業種一覧", desc: "17職種の詳細情報を比較検討", path: "/jobs", image: "/images/forklift.jpg" },
            ].map((s) => (
              <Link key={s.title} href={s.path} className="card overflow-hidden group hover:border-accent transition">
                <div className="relative h-40">
                  <Image src={s.image} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                </div>
                <div className="p-4">
                  <div className="font-bold text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-sub">{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Before/After */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-center text-accent2 mb-10">BWDで得られる未来</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <div className="text-xs font-semibold text-sub uppercase tracking-wider mb-4">今の不安</div>
            <div className="space-y-2">
              {["AIに仕事を奪われるかもしれない", "今のスキルで転職できるか不安", "年齢的にキャリアチェンジは難しい？", "何から始めればいいかわからない", "独学で資格を取れる自信がない"].map((t) => (
                <div key={t} className="flex gap-2.5 p-3 bg-white rounded-lg border border-border">
                  <span className="text-red flex-shrink-0">&#10005;</span>
                  <span className="text-sm text-sub">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">BWD卒業後の未来</div>
            <div className="space-y-2">
              {["AIに代替されない「手に職」スキルを獲得", "国家資格を持つ即戦力として引く手あまた", "年齢不問。40代・50代からの成功例も多数", "AIが全て最適化。迷わず最短ルートで学習", "24時間対応のAI家庭教師で、一人で悩まない"].map((t) => (
                <div key={t} className="flex gap-2.5 p-3 bg-white rounded-lg border border-accent/15">
                  <span className="text-green flex-shrink-0">&#10003;</span>
                  <span className="text-sm text-accent2">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA with background image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero.jpeg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-accent2/85" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">今日が、残りの人生で一番若い日</h2>
          <p className="text-white/80 text-sm mb-8 max-w-lg mx-auto">
            キャリアチェンジに「遅すぎる」はありません。まずは気になる職種を見てみるところから始めましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jobs" className="bg-white text-accent2 font-semibold px-8 py-3 rounded-lg text-[15px] hover:bg-white/90 transition">職業を探す</Link>
            <Link href="/advisor" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg text-[15px] hover:bg-white/10 transition">AIに相談する</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-light text-xs">
        Blue Worker Diamond
      </footer>
    </div>
  );
}
