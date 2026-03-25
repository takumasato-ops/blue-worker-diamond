import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <div className="text-base font-black tracking-tight text-accent mb-10">BWD</div>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-accent2 mb-4">
          あなたの市場価値を、<br />最大化する。
        </h1>
        <p className="text-sub text-[15px] leading-relaxed mb-12">
          高年収ブルーカラー職への最短キャリアチェンジを実現する<br className="hidden sm:block" />
          AIリスキリングプラットフォーム
        </p>

        <p className="text-sm font-medium text-accent2 mb-5">まず何から始めますか？</p>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link href="/advisor" className="btn-primary px-6 py-4 text-[15px] text-center">
            AIキャリアアドバイザーに相談する
            <span className="block text-xs font-normal opacity-80 mt-0.5">何が向いているか、AIと一緒に考える</span>
          </Link>
          <Link href="/jobs" className="btn-secondary px-6 py-4 text-[15px] text-center">
            自分でまず色々見てみる
            <span className="block text-xs font-normal text-sub mt-0.5">業種一覧から気になる職種を探す</span>
          </Link>
        </div>

        <div className="mt-10 flex gap-4 justify-center text-[13px] text-sub">
          <Link href="/about" className="hover:text-text transition">BWDとは</Link>
          <Link href="/dashboard" className="hover:text-text transition">ダッシュボード</Link>
        </div>
      </div>
    </div>
  );
}
