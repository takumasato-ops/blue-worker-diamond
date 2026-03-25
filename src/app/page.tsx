import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Pixel stars background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(1px 1px at 10% 20%, #ffd700 50%, transparent 50%), radial-gradient(1px 1px at 30% 60%, #ffd700 50%, transparent 50%), radial-gradient(1px 1px at 50% 10%, #ffd700 50%, transparent 50%), radial-gradient(1px 1px at 70% 80%, #ffd700 50%, transparent 50%), radial-gradient(1px 1px at 90% 40%, #ffd700 50%, transparent 50%), radial-gradient(2px 2px at 20% 90%, #fff 50%, transparent 50%), radial-gradient(2px 2px at 80% 30%, #fff 50%, transparent 50%)",
      }} />

      <div className="text-center max-w-xl relative">
        <div className="text-accent2 text-2xl font-black tracking-widest mb-6" style={{ textShadow: "0 0 12px rgba(255,215,0,0.5)" }}>
          BLUE WORKER DIAMOND
        </div>
        <div className="rpg-window p-8 mb-8">
          <p className="text-text text-base leading-relaxed mb-2">
            ようこそ、冒険者よ。
          </p>
          <p className="text-sub text-sm leading-relaxed">
            ここは、未来の自分を鍛え上げる修行の地。<br />
            新たなスキルを身につけ、市場価値を最大化し、<br />
            最強のキャリアを手に入れよう。
          </p>
        </div>

        <p className="text-accent2 text-sm font-bold mb-5">&#9654; コマンド を えらべ</p>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link href="/advisor" className="rpg-window px-6 py-4 text-center hover:border-accent transition group cursor-pointer block">
            <div className="text-accent text-[15px] font-bold">&#9654; けんじゃ に そうだん する</div>
            <div className="text-sub text-xs mt-1">AIキャリアアドバイザーが導く</div>
          </Link>
          <Link href="/jobs" className="rpg-window px-6 py-4 text-center hover:border-accent transition group cursor-pointer block">
            <div className="text-accent2 text-[15px] font-bold">&#9654; ギルド を のぞいてみる</div>
            <div className="text-sub text-xs mt-1">業種一覧から冒険先を選ぶ</div>
          </Link>
        </div>

        <div className="mt-10 flex gap-6 justify-center text-[13px] text-light">
          <Link href="/about" className="hover:text-accent2 transition">BWDとは</Link>
          <Link href="/dashboard" className="hover:text-accent2 transition">ステータス</Link>
        </div>
      </div>
    </div>
  );
}
