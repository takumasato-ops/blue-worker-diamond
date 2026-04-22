import Nav from "@/components/Nav";

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-black text-accent2 mb-2">特定商取引法に基づく表記</h1>
        <p className="text-sub text-sm mb-10">施行日: 2026年4月13日</p>

        <div className="card p-6">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {[
                { label: "事業者名", value: "Canal AI" },
                { label: "代表者", value: "佐藤 拓磨" },
                { label: "所在地", value: "お問い合わせいただいた方に個別にお知らせいたします" },
                { label: "電話番号", value: "お問い合わせいただいた方に個別にお知らせいたします" },
                { label: "メールアドレス", value: "takuma.sato@canal-ai.com" },
                { label: "サービス名", value: "Blue Worker Diamond" },
                { label: "販売価格", value: "各プランの料金はサービス内の料金ページに表示のとおり（税込表示）" },
                { label: "支払方法", value: "クレジットカード決済" },
                { label: "支払時期", value: "月額プラン: 利用開始時および毎月同日に自動課金" },
                { label: "商品の引渡時期", value: "決済完了後、即時にサービスをご利用いただけます" },
                { label: "返品・キャンセル", value: "デジタルサービスの性質上、サービス提供開始後の返金は原則として行いません。ただし、サービスに重大な欠陥がある場合は個別に対応いたします。" },
                { label: "解約方法", value: "マイページの設定画面から、いつでも解約手続きが可能です。解約後は次回更新日から課金が停止されます。" },
                { label: "動作環境", value: "Google Chrome、Safari、Firefox、Edgeの最新版。インターネット接続が必要です。" },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="py-4 pr-4 font-medium text-accent2 align-top w-1/3">{row.label}</td>
                  <td className="py-4 text-sub">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-sub">
            ご不明な点がございましたら、<a href="mailto:takuma.sato@canal-ai.com" className="text-accent hover:underline">takuma.sato@canal-ai.com</a> までお問い合わせください。
          </p>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-light text-xs">
        Blue Worker Diamond
      </footer>
    </div>
  );
}
