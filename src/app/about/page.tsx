import Link from "next/link";
import Nav from "@/components/Nav";

const GRADUATES = [
  { name: "田中 健太", age: 34, before: "営業事務 / 年収320万円", after: "第二種電気工事士 / 年収480万円", months: 3, message: "まさか自分が電気工事士になるとは思わなかった。毎日が充実しています。" },
  { name: "鈴木 美咲", age: 28, before: "コールセンター / 年収280万円", after: "2級施工管理技士 / 年収520万円", months: 5, message: "デスクワークの経験が施工管理で意外と活きている。年収はほぼ倍になりました。" },
  { name: "山田 翔太", age: 41, before: "小売店長 / 年収350万円", after: "フォークリフト＋危険物乙4 / 年収430万円", months: 2, message: "40代でも遅くなかった。資格があるだけで面接の反応が全然違う。" },
  { name: "佐々木 裕也", age: 36, before: "一般事務 / 年収300万円", after: "ボイラー2級＋電工2種 / 年収450万円", months: 4, message: "ビルメンに転職して残業がほぼゼロに。家族との時間が増えました。" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block bg-accent/8 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-6">
          About Blue Worker Diamond
        </div>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-accent2 mb-5">
          あなたのキャリアを、<br />ここから変える。
        </h1>
        <p className="text-sub text-base leading-relaxed max-w-2xl mx-auto">
          Blue Worker Diamondは、AIがあなた専属の家庭教師となり、
          高年収ブルーカラー職への最短キャリアチェンジを実現するリスキリングプラットフォームです。
          未経験から資格取得、そして転職成功まで、すべてのプロセスを一気通貫でサポートします。
        </p>
      </div>

      {/* What is BWD */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-xl font-bold text-center text-accent2 mb-10">BWDとは</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: "AIが最適な資格を提案", desc: "あなたの経験・希望年収・適性をAIが分析し、最も市場価値の高い資格を選定。迷わず最短ルートで学習を開始できます。" },
              { num: "02", title: "動画学習＋理解度チェック", desc: "厳選された解説動画で学び、AIが理解度を確認。わからない部分は24時間いつでもAI家庭教師に質問できます。" },
              { num: "03", title: "市場価値を可視化", desc: "学習の進捗に応じて推定年収がリアルタイムで変動。自分の成長が数字で見えるから、モチベーションが続きます。" },
            ].map((f) => (
              <div key={f.num} className="card p-6">
                <div className="text-accent font-mono text-xs font-bold mb-3">{f.num}</div>
                <h3 className="font-bold text-[15px] text-accent2 mb-2">{f.title}</h3>
                <p className="text-sub text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why BWD - Value */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-center text-accent2 mb-3">なぜBWDなのか</h2>
        <p className="text-sub text-sm text-center mb-10">他の学習サービスにはない、BWDだけの価値</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "完全無料で利用可能", desc: "企業が導入費用を負担するため、求職者の費用負担はゼロ。教材・AI家庭教師・キャリア相談すべて無料です。" },
            { title: "未経験からでも大丈夫", desc: "受講者の87%が業界未経験者。AIが一人ひとりのレベルに合わせた学習プランを作成するから、初めてでも安心。" },
            { title: "平均3.2ヶ月で資格取得", desc: "従来の独学では6〜12ヶ月かかる資格取得を、AI最適化カリキュラムで大幅に短縮。最短記録は45日。" },
            { title: "転職まで一気通貫サポート", desc: "資格取得で終わりではなく、提携企業への紹介まで含めたトータルキャリア支援。取得後の就職率は94%。" },
            { title: "挫折させない仕組み", desc: "進捗の可視化、AIからの応援メッセージ、理解度チェックのゲーミフィケーション。続けられる仕組みが全て揃っています。" },
            { title: "年収アップの実績", desc: "卒業生の平均年収アップ額は+152万円。中には年収が2倍以上になった方もいます。" },
          ].map((v) => (
            <div key={v.title} className="flex gap-4 p-5 card">
              <span className="text-green mt-0.5 flex-shrink-0 text-lg">&#10003;</span>
              <div>
                <div className="font-bold text-sm text-accent2 mb-1">{v.title}</div>
                <div className="text-sub text-[13px] leading-relaxed">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <div className="bg-bg2 border-y border-border">
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
      </div>

      {/* Graduates */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-center text-accent2 mb-3">卒業生の声</h2>
        <p className="text-sub text-sm text-center mb-10">BWDでキャリアを変えた方々のリアルなストーリー</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GRADUATES.map((g) => (
            <div key={g.name} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                  {g.name[0]}
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

      {/* Before/After journey */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-xl font-bold text-center text-accent2 mb-10">BWDで得られる未来</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-xs font-semibold text-sub uppercase tracking-wider mb-4">今の不安</div>
              <div className="space-y-3">
                {[
                  "AIに仕事を奪われるかもしれない",
                  "今のスキルで転職できるか不安",
                  "年齢的にキャリアチェンジは難しい？",
                  "何から始めればいいかわからない",
                  "独学で資格を取れる自信がない",
                ].map((t) => (
                  <div key={t} className="flex gap-2.5 p-3 bg-white rounded-lg border border-border">
                    <span className="text-red flex-shrink-0">&#10005;</span>
                    <span className="text-sm text-sub">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">BWD卒業後の未来</div>
              <div className="space-y-3">
                {[
                  "AIに代替されない「手に職」スキルを獲得",
                  "国家資格を持つ即戦力として転職市場で引く手あまた",
                  "年齢不問。40代・50代からの転職成功例も多数",
                  "AIが全て最適化。迷わず最短ルートで学習できる",
                  "24時間対応のAI家庭教師で、一人で悩まない",
                ].map((t) => (
                  <div key={t} className="flex gap-2.5 p-3 bg-white rounded-lg border border-accent/15">
                    <span className="text-green flex-shrink-0">&#10003;</span>
                    <span className="text-sm text-accent2">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-accent2 mb-3">今日が、残りの人生で一番若い日</h2>
        <p className="text-sub text-sm mb-8 max-w-lg mx-auto">
          キャリアチェンジに「遅すぎる」はありません。まずは気になる職種を見てみるところから始めましょう。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/jobs" className="btn-primary px-8 py-3 text-[15px]">職業を探す</Link>
          <Link href="/advisor" className="btn-secondary px-8 py-3 text-[15px]">AIに相談する</Link>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-light text-xs">
        Blue Worker Diamond
      </footer>
    </div>
  );
}
