"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { getProfile, UserProfile, CERTIFICATIONS } from "@/lib/store";
import Mascot from "@/components/Mascot";

const FALLBACK_MESSAGES = [
  "原石が光ってきましたね！今日も一歩前進しましょう！",
  "毎日の積み重ねが、ダイヤモンドの輝きになります！",
  "あなたの市場価値が上がっています！今日も頑張りましょう！",
];

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [showValueInfo, setShowValueInfo] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setMessage(FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)]);
    if (p.tutorPlans?.length > 0) setActivePlanId(p.tutorPlans[0].id);
    if (p.targetCert) {
      const progress = p.totalHours > 0 ? Math.round((p.studyHours / p.totalHours) * 100) : 0;
      const context = `名前:${p.name}, 資格:${p.targetCert}, 進捗:${progress}%`;
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "remind", messages: [{ role: "user", text: "応援メッセージを1つください" }], context }),
      }).then((r) => r.json()).then((d) => { if (d.text) setMessage(d.text); }).catch(() => {});
    }
  }, []);

  if (!profile || !profile.targetCert) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center mb-10">
            <Mascot message="ようこそ！まずは気になる職業を探してみよう！" mood="cheer" size={90} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/jobs" className="card p-6 hover:border-accent transition text-center">
              <div className="text-2xl mb-3">&#x1F4CB;</div>
              <div className="font-bold text-[15px] mb-1">業種一覧を見る</div>
              <div className="text-xs text-sub">資格・給与・キャリアパスを確認</div>
            </a>
            <a href="/advisor" className="card p-6 hover:border-accent transition text-center">
              <div className="text-2xl mb-3">&#x1F4AC;</div>
              <div className="font-bold text-[15px] mb-1">キャリア相談をする</div>
              <div className="text-xs text-sub">AIアドバイザーに何でも質問</div>
            </a>
            <a href="/onboarding" className="card p-6 hover:border-accent transition text-center sm:col-span-2">
              <div className="text-2xl mb-3">&#x1F48E;</div>
              <div className="font-bold text-[15px] mb-1">AI診断で最適な資格を見つける</div>
              <div className="text-xs text-sub">プロフィールを入力して、AIがあなたに最適な資格・ロードマップを提案</div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const plans = profile.tutorPlans || [];
  const activePlan = plans.find((p) => p.id === activePlanId);

  // Active plan stats
  const planProgress = activePlan ? Math.round((activePlan.weeks.filter((w) => w.done).length / activePlan.weeks.length) * 100) : 0;
  const planCert = activePlan?.cert || profile.targetCert;
  const planDaysLeft = activePlan ? Math.ceil((new Date(activePlan.goalDate).getTime() - Date.now()) / 86400000) : null;
  const certInfo = CERTIFICATIONS.find((c) => c.name === planCert);
  // Market value: starts at 22, grows toward cert's target salary based on progress
  const baseSalary = 22;
  const targetSalary = certInfo?.salary || 30;
  const currentValue = baseSalary + Math.round((targetSalary - baseSalary) * (planProgress / 100));

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile header */}
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center text-base font-bold flex-shrink-0">
              {(profile.name || "?")[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px]">{profile.name || "ゲスト"}</span>
                {!profile.name && <a href="/onboarding" className="text-[11px] px-2 py-0.5 rounded border border-accent text-accent hover:bg-accent/5 transition">会員登録する</a>}
              </div>
              <div className="text-xs text-sub">{profile.age > 0 ? `${profile.age}歳` : ""}{profile.currentJob ? ` / ${profile.currentJob}` : ""}</div>
            </div>
            <button onClick={() => setShowValueInfo(true)} className="text-right hover:opacity-80 transition">
              <div className="text-xl font-black gradient-text">{currentValue}<span className="text-xs text-sub font-normal ml-0.5">万円/月</span></div>
              <div className="text-[10px] text-accent underline">市場価値とは？</div>
            </button>
          </div>
        </div>

        {/* Market Value Info Modal */}
        {showValueInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50" onClick={() => setShowValueInfo(false)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">市場価値について</h2>
                <button onClick={() => setShowValueInfo(false)} className="text-sub hover:text-text">&#10005;</button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-bg2 rounded-xl p-4 text-center">
                  <div className="text-sub text-xs mb-1">あなたの現在の市場価値</div>
                  <div className="text-3xl font-black gradient-text">{currentValue}<span className="text-base text-sub font-normal ml-1">万円/月</span></div>
                  <div className="text-xs text-sub mt-1">目標: {targetSalary}万円/月（{planCert}取得時）</div>
                  <div className="bg-white rounded-full h-2 mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${planProgress}%`, background: "#635bff" }} /></div>
                </div>

                <div>
                  <h3 className="font-bold text-accent2 mb-2">市場価値とは？</h3>
                  <p className="text-sub leading-relaxed">
                    あなたが資格を取得した場合に、実際の求人市場で期待できる<strong>月収の目安</strong>です。
                    求人サイト（indeed、求人ボックス等）の実際の求人データと、各資格保有者の平均給与をもとに算出しています。
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-accent2 mb-2">どうすれば上がる？</h3>
                  <p className="text-sub leading-relaxed mb-2">
                    学習プランの週タスクを完了し、<strong>進捗率を上げる</strong>ことで市場価値が上昇します。
                    進捗100%（資格取得相当）で、その資格の想定月給に到達します。
                  </p>
                  <div className="bg-bg2 rounded-lg p-3 space-y-1.5">
                    {[
                      { label: "学習開始時", value: `${baseSalary}万円`, prog: "0%" },
                      { label: "学習25%完了", value: `${baseSalary + Math.round((targetSalary - baseSalary) * 0.25)}万円`, prog: "25%" },
                      { label: "学習50%完了", value: `${baseSalary + Math.round((targetSalary - baseSalary) * 0.5)}万円`, prog: "50%" },
                      { label: "資格取得（100%）", value: `${targetSalary}万円`, prog: "100%" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between text-xs">
                        <span className="text-sub">{r.label}（{r.prog}）</span>
                        <span className="font-bold">{r.value}/月</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-accent2 mb-2">算出根拠</h3>
                  <p className="text-sub leading-relaxed">
                    各資格の想定月給は、以下の情報源をもとにした実際の相場です:
                  </p>
                  <ul className="text-sub text-xs space-y-1 mt-2">
                    <li>・ 求人サイト（indeed、求人ボックス、doda）の求人データ平均</li>
                    <li>・ 厚生労働省「賃金構造基本統計調査」</li>
                    <li>・ 各業界団体の給与実態調査</li>
                    <li>・ 資格取得後1〜3年の実務経験者の中央値</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-accent2 mb-2">さらに上げるには</h3>
                  <div className="space-y-2">
                    {[
                      "複数資格の取得（例: 電工2種＋危険物乙4 → 組み合わせで価値UP）",
                      "上位資格へのステップアップ（例: 2級→1級施工管理技士）",
                      "実務経験を積むことで3〜5年で想定月給を超える可能性",
                      "独立開業でさらなる収入アップも現実的",
                    ].map((t) => (
                      <div key={t} className="flex gap-2 text-xs">
                        <span className="text-green flex-shrink-0">&#10003;</span>
                        <span className="text-sub">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setShowValueInfo(false)} className="btn-primary w-full py-2.5 text-sm mt-5">閉じる</button>
            </div>
          </div>
        )}

        {/* Mascot Message */}
        <div className="mb-6 px-2">
          <Mascot message={message} mood="happy" size={60} />
        </div>

        {/* Learning plans - each as a card */}
        {plans.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-sub mb-3 font-medium">学習中の資格</div>
            <div className="space-y-3">
              {plans.map((p) => {
                const doneWeeks = p.weeks.filter((w) => w.done).length;
                const prog = Math.round((doneWeeks / p.weeks.length) * 100);
                const days = Math.ceil((new Date(p.goalDate).getTime() - Date.now()) / 86400000);
                const ci = CERTIFICATIONS.find((c) => c.name === p.cert);
                const targetVal = ci?.salary || 30;
                const val = 22 + Math.round((targetVal - 22) * (prog / 100));
                const isActive = activePlanId === p.id;
                const examStatus = p.examResult === "passed" ? "合格" : p.examResult === "failed" ? "不合格" : p.examApplied ? "受験予定" : null;

                return (
                  <div key={p.id}>
                    <button
                      onClick={() => setActivePlanId(isActive ? null : p.id)}
                      className={`card w-full text-left p-4 transition ${isActive ? "border-accent ring-1 ring-accent/20" : "hover:border-accent/30"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{p.cert}</span>
                            {examStatus && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.examResult === "passed" ? "bg-green/10 text-green" : p.examResult === "failed" ? "bg-red/10 text-red" : "bg-accent/10 text-accent"}`}>
                                {examStatus}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex-1 bg-bg2 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, background: "#635bff" }} />
                            </div>
                            <span className="text-xs font-bold text-accent w-10 text-right">{prog}%</span>
                          </div>
                        </div>
                        <span className={`text-sub text-xs transition ${isActive ? "rotate-180" : ""}`}>&#9662;</span>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isActive && (
                      <div className="card border-t-0 rounded-t-none p-4 -mt-[1px] space-y-4">
                        {/* Stats grid */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-bg2 rounded-lg p-2.5 text-center">
                            <div className="text-[10px] text-sub">進捗</div>
                            <div className="text-base font-black">{prog}<span className="text-[10px] text-sub">%</span></div>
                            <div className="text-[10px] text-sub">{doneWeeks}/{p.weeks.length}週</div>
                          </div>
                          <div className="bg-bg2 rounded-lg p-2.5 text-center">
                            <div className="text-[10px] text-sub">正答率</div>
                            <div className="text-base font-black text-green">{profile.quizTotal > 0 ? Math.round((profile.quizCorrect / profile.quizTotal) * 100) : 0}<span className="text-[10px] text-sub">%</span></div>
                            <div className="text-[10px] text-sub">{profile.quizCorrect}/{profile.quizTotal}問</div>
                          </div>
                          <div className="bg-bg2 rounded-lg p-2.5 text-center">
                            <div className="text-[10px] text-sub">残り日数</div>
                            <div className={`text-base font-black ${days <= 14 ? "text-red" : days <= 30 ? "text-orange" : ""}`}>{days}<span className="text-[10px] text-sub">日</span></div>
                            <div className="text-[10px] text-sub">〜{p.goalDate.slice(5)}</div>
                          </div>
                          <div className="bg-bg2 rounded-lg p-2.5 text-center">
                            <div className="text-[10px] text-sub">市場価値</div>
                            <div className="text-base font-black gradient-text">{val}<span className="text-[10px] text-sub">万</span></div>
                            <div className="text-[10px] text-green">+{val - 22}万</div>
                          </div>
                        </div>

                        {/* Future vision */}
                        {ci?.future && (
                          <div className="bg-green/5 border border-green/15 rounded-lg p-3">
                            <div className="text-[10px] font-semibold text-green mb-0.5">この資格を取ると...</div>
                            <div className="text-xs text-text">{ci.future}</div>
                          </div>
                        )}

                        {/* Info row */}
                        <div className="flex gap-2 text-xs text-sub">
                          <span>目標日: {p.goalDate}</span>
                          <span>|</span>
                          <span>学習時間: {ci?.hours || "—"}h</span>
                          <span>|</span>
                          <span>需要: {ci?.demand || "—"}</span>
                        </div>

                        {/* Action */}
                        <a href={`/learn?cert=${encodeURIComponent(p.cert)}`} className="btn-primary block text-center py-2.5 text-sm">
                          {p.cert}の学習を続ける
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic Performance */}
        {profile.topicScores && profile.topicScores.length > 0 && (
          <div className="card p-5 mb-6">
            <h3 className="text-xs font-semibold text-sub uppercase tracking-wider mb-3">分野別の成績</h3>
            <div className="space-y-2">
              {profile.topicScores.map((ts) => {
                const rate = ts.total > 0 ? Math.round((ts.correct / ts.total) * 100) : 0;
                const isWeak = rate < 60;
                return (
                  <div key={ts.topic} className="flex items-center gap-3">
                    <span className="text-xs w-24 truncate text-sub">{ts.topic}</span>
                    <div className="flex-1 bg-bg2 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${rate}%`, background: isWeak ? "#f59e0b" : "#22c55e" }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-10 text-right ${isWeak ? "text-orange-500" : "text-green"}`}>{rate}%</span>
                    {isWeak && <span className="text-[10px] text-orange-500">要復習</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a href={`/learn?cert=${encodeURIComponent(planCert)}`} className="card p-4 hover:border-accent transition text-center">
            <div className="text-sm font-medium">学習を続ける</div>
            <div className="text-[10px] text-sub mt-0.5">プラン・動画・テスト</div>
          </a>
          <a href="/jobs" className="card p-4 hover:border-accent transition text-center">
            <div className="text-sm font-medium">業種一覧</div>
            <div className="text-[10px] text-sub mt-0.5">他の職種も見てみる</div>
          </a>
        </div>

        {/* Reset */}
        <div className="text-center mt-10 mb-4">
          <button onClick={() => { if (window.confirm("プロフィール・学習データをすべてリセットしますか？")) { localStorage.clear(); window.location.href = "/"; } }}
            className="text-xs text-light hover:text-red transition">プロフィールをリセット</button>
        </div>
      </div>
    </div>
  );
}
