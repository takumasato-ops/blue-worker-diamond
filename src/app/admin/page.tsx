"use client";
import Nav from "@/components/Nav";
import { MOCK_USERS } from "@/lib/store";

export default function AdminPage() {
  const total = MOCK_USERS.length;
  const ready = MOCK_USERS.filter((u) => u.status === "紹介可能").length;
  const avgProgress = Math.round(MOCK_USERS.reduce((s, u) => s + u.progress, 0) / total);
  const avgQuiz = Math.round(MOCK_USERS.reduce((s, u) => s + u.quizRate, 0) / total);

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold mb-8">管理者ダッシュボード</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "登録ユーザー", value: total, unit: "人" },
            { label: "紹介可能", value: ready, unit: "人", highlight: true },
            { label: "平均進捗", value: avgProgress, unit: "%" },
            { label: "平均正答率", value: avgQuiz, unit: "%" },
          ].map((c) => (
            <div key={c.label} className="card p-5">
              <div className="text-sub text-xs mb-2">{c.label}</div>
              <div className={`text-2xl font-black ${c.highlight ? "text-green" : "text-text"}`}>
                {c.value}
                <span className="text-sm font-normal text-sub ml-1">{c.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-sm">ユーザー一覧</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["名前", "目標資格", "進捗", "正答率", "市場価値", "ステータス"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-light uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-bg2 transition">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-sub">{u.cert}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-bg2 rounded-full h-1.5">
                          <div className="h-full rounded-full" style={{ width: `${u.progress}%`, background: "#635bff" }} />
                        </div>
                        <span className="text-xs text-sub">{u.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={u.quizRate >= 80 ? "text-green font-medium" : "text-sub"}>{u.quizRate}%</span>
                    </td>
                    <td className="px-6 py-4 font-bold">{u.value}万円</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "紹介可能" ? "bg-green/10 text-green border border-green/20" : "bg-accent/10 text-accent border border-accent/20"}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
