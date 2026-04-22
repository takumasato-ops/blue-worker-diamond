import Link from "next/link";
import Nav from "@/components/Nav";

const SECTIONS = [
  {
    title: "第1条（サービス概要）",
    content: [
      "Blue Worker Diamond（以下「本サービス」）は、Canal AIが運営する、AI技術を活用したブルーカラー向け資格学習プラットフォームです。",
      "本サービスは、AIによる学習最適化、動画教材の提供、資格取得支援、および企業マッチング機能を通じて、利用者のキャリアアップを支援します。",
      "本規約は、本サービスの利用に関する条件を定めるものであり、利用者は本規約に同意の上、本サービスを利用するものとします。",
    ],
  },
  {
    title: "第2条（利用条件）",
    content: [
      "1. 本サービスには無料プランおよび有料プランがあります。各プランの内容・料金は、本サービス上に別途表示するものとします。",
      "2. 有料プランの利用にあたっては、所定の料金を支払うものとします。料金の支払方法、返金条件等は別途定めるところによります。",
      "3. 利用者は、本サービスの利用にあたり、正確かつ最新の情報を登録するものとします。",
      "4. 利用者は、自己の責任においてアカウント情報を管理し、第三者に利用させてはなりません。",
    ],
  },
  {
    title: "第3条（知的財産権）",
    content: [
      "1. 本サービスに含まれるすべてのコンテンツ（テキスト、画像、動画、ソフトウェア、AI生成物等）の知的財産権は、Canal AIまたは正当な権利者に帰属します。",
      "2. 利用者は、本サービスのコンテンツを、私的利用の範囲を超えて複製、転載、配布、販売等してはなりません。",
      "3. 利用者が本サービス上で入力した学習データ等は、サービス改善・AI学習最適化の目的で匿名化した上で利用することがあります。",
    ],
  },
  {
    title: "第4条（免責事項）",
    content: [
      "1. 本サービスで提供されるAI生成コンテンツ（学習アドバイス、クイズ解説等）の正確性・完全性を保証するものではありません。",
      "2. 本サービスの利用により資格試験の合格を保証するものではありません。試験の合否は利用者自身の学習状況に依存します。",
      "3. 本サービスの利用に起因して利用者に生じた損害について、Canal AIは故意または重大な過失がある場合を除き、一切の責任を負いません。",
      "4. 本サービスで表示される年収・市場価値は推定値であり、実際の雇用条件を保証するものではありません。",
    ],
  },
  {
    title: "第5条（禁止事項）",
    content: [
      "利用者は、以下の行為を行ってはなりません。",
      "- 法令または公序良俗に反する行為",
      "- 本サービスの運営を妨害する行為",
      "- 他の利用者の個人情報を収集・蓄積する行為",
      "- 不正アクセス、リバースエンジニアリング等の行為",
      "- 本サービスのコンテンツを無断で二次利用・商用利用する行為",
      "- その他、Canal AIが不適切と判断する行為",
    ],
  },
  {
    title: "第6条（サービスの変更・停止）",
    content: [
      "1. Canal AIは、利用者への事前通知なくして、本サービスの内容を変更し、または一時的もしくは永続的に停止することができます。",
      "2. Canal AIは、前項の変更・停止により利用者に生じた損害について、一切の責任を負いません。",
    ],
  },
  {
    title: "第7条（個人情報の取り扱い）",
    content: [
      "利用者の個人情報の取り扱いについては、別途定めるプライバシーポリシーに従います。",
    ],
  },
  {
    title: "第8条（準拠法・管轄裁判所）",
    content: [
      "1. 本規約の解釈は日本法に準拠するものとします。",
      "2. 本サービスに関連して紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-black text-accent2 mb-2">利用規約</h1>
        <p className="text-sub text-sm mb-10">施行日: 2026年4月13日</p>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-bold text-accent2 mb-3">{s.title}</h2>
              <div className="card p-5 space-y-2 text-sub text-sm leading-relaxed">
                {s.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 card p-5">
          <h2 className="text-base font-bold text-accent2 mb-3">運営者情報</h2>
          <div className="text-sm text-sub space-y-1">
            <p>事業者名: Canal AI</p>
            <p>メール: <a href="mailto:takuma.sato@canal-ai.com" className="text-accent hover:underline">takuma.sato@canal-ai.com</a></p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-sub">
          <Link href="/privacy" className="text-accent hover:underline">プライバシーポリシー</Link>
          <span className="mx-2">|</span>
          <Link href="/legal" className="text-accent hover:underline">特定商取引法に基づく表記</Link>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-light text-xs">
        Blue Worker Diamond
      </footer>
    </div>
  );
}
