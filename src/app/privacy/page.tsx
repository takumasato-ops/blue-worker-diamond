import Link from "next/link";
import Nav from "@/components/Nav";

const SECTIONS = [
  {
    title: "1. 収集する個人情報",
    content: [
      "本サービスでは、以下の個人情報を収集することがあります。",
      "- 氏名、メールアドレス、電話番号（会員登録・お問い合わせ時）",
      "- 年齢、現在の職業、希望年収等のプロフィール情報（AI診断・学習最適化のため）",
      "- 学習履歴、クイズ正答率、進捗データ（学習の最適化のため）",
      "- アクセスログ、利用端末情報、IPアドレス（サービス改善・セキュリティのため）",
    ],
  },
  {
    title: "2. 利用目的",
    content: [
      "収集した個人情報は、以下の目的で利用します。",
      "- 本サービスの提供・運営・改善",
      "- AIによる学習プランの最適化・個別指導の精度向上",
      "- 利用者の学習進捗に基づく統計分析（匿名化した上で実施）",
      "- 利用者の同意に基づく、提携企業への人材紹介（企業マッチング）",
      "- お問い合わせへの回答・サポート",
      "- サービスに関する重要なお知らせの通知",
    ],
  },
  {
    title: "3. 第三者提供",
    content: [
      "Canal AIは、以下の場合を除き、利用者の個人情報を第三者に提供しません。",
      "- 利用者の同意がある場合（企業マッチングの際、利用者の了承を得た上で提携企業に提供）",
      "- 法令に基づき開示が求められた場合",
      "- 人の生命、身体または財産の保護のために必要がある場合",
      "- 統計データとして匿名加工した情報を提供する場合",
    ],
  },
  {
    title: "4. Cookie・アクセス解析",
    content: [
      "本サービスでは、利用状況の分析・サービス改善のためにCookieおよびアクセス解析ツール（Google Analytics等）を使用することがあります。",
      "Cookieは、ブラウザの設定により無効化することが可能です。ただし、一部のサービス機能が制限される場合があります。",
      "アクセス解析で収集するデータは、個人を特定しない統計情報として利用します。",
    ],
  },
  {
    title: "5. データの保管・セキュリティ",
    content: [
      "Canal AIは、収集した個人情報の漏洩、滅失、毀損の防止のため、適切なセキュリティ対策を講じます。",
      "個人情報は、利用目的に必要な期間に限り保管し、不要になった場合は速やかに削除します。",
      "データは暗号化通信（SSL/TLS）を使用して送受信されます。",
    ],
  },
  {
    title: "6. ユーザーの権利",
    content: [
      "利用者は、Canal AIに対して以下の請求を行うことができます。",
      "- 個人情報の開示請求",
      "- 個人情報の訂正・追加・削除の請求",
      "- 個人情報の利用停止・消去の請求",
      "- 第三者提供の停止の請求",
      "上記の請求は、下記のお問い合わせ先までご連絡ください。ご本人確認の上、合理的な期間内に対応いたします。",
    ],
  },
  {
    title: "7. プライバシーポリシーの変更",
    content: [
      "Canal AIは、必要に応じて本プライバシーポリシーの内容を変更することがあります。",
      "重要な変更がある場合は、本サービス上で通知します。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-black text-accent2 mb-2">プライバシーポリシー</h1>
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
          <h2 className="text-base font-bold text-accent2 mb-3">お問い合わせ先</h2>
          <div className="text-sm text-sub space-y-1">
            <p>事業者名: Canal AI</p>
            <p>個人情報保護に関するお問い合わせ: <a href="mailto:takuma.sato@canal-ai.com" className="text-accent hover:underline">takuma.sato@canal-ai.com</a></p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-sub">
          <Link href="/terms" className="text-accent hover:underline">利用規約</Link>
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
