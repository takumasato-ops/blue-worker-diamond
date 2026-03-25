"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { getProfile, saveProfile, UserProfile, TutorPlan, TutorWeek } from "@/lib/store";

const FALLBACK_MESSAGES = [
  "原石が光ってきましたね！今日も一歩前進しましょう！",
  "毎日の積み重ねが、ダイヤモンドの輝きになります！",
  "あなたの市場価値が上がっています！今日も頑張りましょう！",
];

function generateWeeklyPlan(cert: string, goalDate: string, totalHours: number): TutorWeek[] {
  const now = new Date();
  const goal = new Date(goalDate);
  const diffMs = goal.getTime() - now.getTime();
  const totalWeeks = Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));
  const hoursPerWeek = Math.ceil(totalHours / totalWeeks);

  const tasks = [
    { phase: "基礎知識のインプット", ratio: 0.25 },
    { phase: "過去問演習（基礎）", ratio: 0.2 },
    { phase: "実技・実践対策", ratio: 0.25 },
    { phase: "過去問演習（応用）", ratio: 0.15 },
    { phase: "模擬試験＆弱点補強", ratio: 0.1 },
    { phase: "最終仕上げ・総復習", ratio: 0.05 },
  ];

  const weeks: TutorWeek[] = [];
  let weekNum = 1;
  let remainWeeks = totalWeeks;

  for (const t of tasks) {
    const phaseWeeks = Math.max(1, Math.round(totalWeeks * t.ratio));
    for (let i = 0; i < phaseWeeks && weekNum <= totalWeeks; i++) {
      const deadline = new Date(now.getTime() + weekNum * 7 * 24 * 60 * 60 * 1000);
      weeks.push({
        week: weekNum,
        deadline: deadline.toISOString().split("T")[0],
        task: `${t.phase}（${cert}）`,
        hours: hoursPerWeek,
        done: false,
      });
      weekNum++;
      remainWeeks--;
    }
  }

  // Fill remaining weeks
  while (weekNum <= totalWeeks) {
    const deadline = new Date(now.getTime() + weekNum * 7 * 24 * 60 * 60 * 1000);
    weeks.push({
      week: weekNum,
      deadline: deadline.toISOString().split("T")[0],
      task: `総復習＆弱点補強（${cert}）`,
      hours: hoursPerWeek,
      done: false,
    });
    weekNum++;
  }

  return weeks;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalDate, setGoalDate] = useState("");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<Record<string, string>>({});
  const [adviceLoading, setAdviceLoading] = useState<string | null>(null);

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

  const createPlan = () => {
    if (!goalDate || !profile) return;
    const plan: TutorPlan = {
      id: Date.now().toString(),
      cert: profile.targetCert,
      goalDate,
      createdAt: new Date().toISOString().split("T")[0],
      weeks: generateWeeklyPlan(profile.targetCert, goalDate, profile.totalHours),
    };
    const plans = [...(profile.tutorPlans || []), plan];
    const updated = saveProfile({ tutorPlans: plans, goalDate });
    setProfile(updated);
    setActivePlanId(plan.id);
    setShowGoalForm(false);
    setGoalDate("");
    fetchAdvice(plan);
  };

  const toggleWeekDone = (planId: string, weekNum: number) => {
    if (!profile) return;
    const plans = (profile.tutorPlans || []).map((p) => {
      if (p.id !== planId) return p;
      return { ...p, weeks: p.weeks.map((w) => w.week === weekNum ? { ...w, done: !w.done } : w) };
    });
    const updated = saveProfile({ tutorPlans: plans });
    setProfile(updated);
  };

  const deletePlan = (planId: string) => {
    if (!profile) return;
    const plans = (profile.tutorPlans || []).filter((p) => p.id !== planId);
    const updated = saveProfile({ tutorPlans: plans });
    setProfile(updated);
    setActivePlanId(plans.length > 0 ? plans[0].id : null);
  };

  const fetchAdvice = async (plan: TutorPlan) => {
    setAdviceLoading(plan.id);
    try {
      const doneWeeks = plan.weeks.filter((w) => w.done).length;
      const totalWeeks = plan.weeks.length;
      const currentWeek = plan.weeks.find((w) => !w.done);
      const context = `資格:${plan.cert}, 目標日:${plan.goalDate}, 進捗:${doneWeeks}/${totalWeeks}週完了, 今週のタスク:${currentWeek?.task || "なし"}, 今週の目標時間:${currentWeek?.hours || 0}時間`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "tutor",
          messages: [{ role: "user", text: "今の進捗を踏まえて、今週やるべきことの具体的なアドバイスを100文字以内でください。" }],
          context,
        }),
      });
      const data = await res.json();
      setAiAdvice((prev) => ({ ...prev, [plan.id]: data.text }));
    } catch {
      setAiAdvice((prev) => ({ ...prev, [plan.id]: "アドバイスの取得に失敗しました。" }));
    }
    setAdviceLoading(null);
  };

  if (!profile || !profile.targetCert) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold mb-2 text-accent2">ぼうけんの はじまり</h1>
            <p className="text-sub">まずは したい ことを えらべ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/jobs" className="rpg-window p-6 hover:border-accent transition text-center block">
              <div className="text-accent2 font-bold text-[15px] mb-1">&#9654; ギルド を みる</div>
              <div className="text-xs text-sub">業種・資格・給与を確認</div>
            </a>
            <a href="/advisor" className="rpg-window p-6 hover:border-accent transition text-center block">
              <div className="text-accent font-bold text-[15px] mb-1">&#9654; けんじゃ に きく</div>
              <div className="text-xs text-sub">AIアドバイザーに相談</div>
            </a>
            <a href="/onboarding" className="rpg-window p-6 hover:border-accent transition text-center sm:col-span-2 block">
              <div className="text-green font-bold text-[15px] mb-1">&#9654; てんしょく しんだん</div>
              <div className="text-xs text-sub">AIがあなたに最適な資格・ロードマップを提案</div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const progress = profile.totalHours > 0 ? Math.round((profile.studyHours / profile.totalHours) * 100) : 0;
  const currentValue = profile.marketValue + Math.round(progress * 0.2);
  const remainHours = profile.totalHours - profile.studyHours;
  const completedSteps = profile.roadmap.filter((r) => r.completed).length;
  const plans = profile.tutorPlans || [];
  const activePlan = plans.find((p) => p.id === activePlanId);

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Message from Sage */}
        <div className="rpg-window p-5 mb-8">
          <div className="text-xs text-accent2 mb-2">&#9733; けんじゃ の ことば</div>
          <div className="text-sm text-text">{message}</div>
        </div>

        {/* RPG Status */}
        <div className="rpg-window p-6 mb-8">
          <div className="text-accent2 font-bold text-sm mb-4">&#9733; {profile.name || "ゆうしゃ"} の ステータス</div>
          <div className="space-y-3">
            {/* Market Value as Level */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-sub w-16">しじょうち</span>
              <span className="text-accent2 font-bold text-lg" style={{ textShadow: "0 0 8px rgba(255,215,0,0.3)" }}>{currentValue}万円/月</span>
              <span className="text-xs text-green">+{currentValue - 22}万円 UP</span>
            </div>
            {/* EXP Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-sub w-16">EXP</span>
              <div className="flex-1 bg-surface rounded h-3 overflow-hidden border border-border">
                <div className="exp-bar h-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-accent2 w-12 text-right">{progress}%</span>
            </div>
            {/* Target */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-sub w-16">もくひょう</span>
              <span className="text-sm">{profile.targetCert}</span>
              <span className="text-xs text-sub">（のこり {remainHours}じかん）</span>
            </div>
            {/* Quiz */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-sub w-16">せいとうりつ</span>
              <div className="flex-1 bg-surface rounded h-3 overflow-hidden border border-border">
                <div className="hp-bar h-full transition-all" style={{ width: `${profile.quizTotal > 0 ? Math.round((profile.quizCorrect / profile.quizTotal) * 100) : 0}%` }} />
              </div>
              <span className="text-xs text-green w-12 text-right">{profile.quizTotal > 0 ? Math.round((profile.quizCorrect / profile.quizTotal) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Tutor Plans */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base text-accent2">&#9733; さくせん</h2>
            <button onClick={() => setShowGoalForm(!showGoalForm)} className="btn-primary text-xs px-4 py-1.5">
              {showGoalForm ? "とじる" : "あたらしい さくせん"}
            </button>
          </div>

          {/* Goal Form */}
          {showGoalForm && (
            <div className="rpg-window p-4 mb-5">
              <div className="text-sm font-medium mb-3 text-accent2">いつまでに {profile.targetCert} を てにいれる？</div>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-sub mb-1">目標日</label>
                  <input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <button onClick={createPlan} disabled={!goalDate} className="btn-primary px-5 py-2 text-sm disabled:opacity-40">
                  さくせん を たてる
                </button>
              </div>
            </div>
          )}

          {/* Plan Tabs */}
          {plans.length > 0 && (
            <>
              {plans.length > 1 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {plans.map((p) => (
                    <button key={p.id} onClick={() => setActivePlanId(p.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition ${activePlanId === p.id ? "bg-accent/10 text-accent" : "bg-bg2 text-sub hover:text-text"}`}>
                      {p.cert}（〜{p.goalDate}）
                    </button>
                  ))}
                </div>
              )}

              {activePlan && (() => {
                const daysLeft = getDaysLeft(activePlan.goalDate);
                const doneWeeks = activePlan.weeks.filter((w) => w.done).length;
                const planProgress = Math.round((doneWeeks / activePlan.weeks.length) * 100);
                const currentWeekIdx = activePlan.weeks.findIndex((w) => !w.done);

                return (
                  <div>
                    {/* Plan Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm font-medium">{activePlan.cert}</div>
                        <div className="text-xs text-sub">
                          目標: {activePlan.goalDate}（残り
                          <span className={daysLeft <= 14 ? "text-red font-medium" : daysLeft <= 30 ? "text-orange font-medium" : "text-green font-medium"}>
                            {daysLeft}日
                          </span>
                          ）
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-black text-accent">{planProgress}%</div>
                          <div className="text-[10px] text-sub">{doneWeeks}/{activePlan.weeks.length}週</div>
                        </div>
                        <button onClick={() => deletePlan(activePlan.id)} className="text-xs text-light hover:text-red transition">削除</button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="bg-bg2 rounded-full h-2 overflow-hidden mb-4">
                      <div className="h-full rounded-full transition-all" style={{ width: `${planProgress}%`, background: "#635bff" }} />
                    </div>

                    {/* AI Advice */}
                    <div className="bg-accent/5 border border-accent/15 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-accent2">&#9733; しどうしゃ の アドバイス</div>
                        <button onClick={() => fetchAdvice(activePlan)} disabled={adviceLoading === activePlan.id}
                          className="text-[11px] text-accent hover:underline disabled:opacity-50">
                          {adviceLoading === activePlan.id ? "取得中..." : "更新"}
                        </button>
                      </div>
                      <div className="text-sm text-text">
                        {aiAdvice[activePlan.id] || "「更新」を押すと、AIが今週のアドバイスを表示します。"}
                      </div>
                    </div>

                    {/* Weekly plan */}
                    <div className="space-y-1.5">
                      {activePlan.weeks.map((w, i) => {
                        const isPast = new Date(w.deadline) < new Date() && !w.done;
                        const isCurrent = i === currentWeekIdx;
                        return (
                          <div key={w.week}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                              w.done ? "border-green/20 bg-green/5" :
                              isCurrent ? "border-accent/30 bg-accent/5" :
                              isPast ? "border-red/20 bg-red/5" :
                              "border-border"
                            }`}>
                            <button onClick={() => toggleWeekDone(activePlan.id, w.week)}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 border ${
                                w.done ? "bg-green text-white border-green" : "border-border hover:border-accent"
                              }`}>
                              {w.done && "\u2713"}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-[13px] truncate">
                                Week {w.week}: {w.task}
                              </div>
                              <div className="text-xs text-sub">
                                期限: {w.deadline} / 目安: {w.hours}時間
                                {isPast && <span className="text-red ml-1">（期限超過）</span>}
                                {isCurrent && <span className="text-accent ml-1">（今週）</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {plans.length === 0 && !showGoalForm && (
            <div className="text-center py-8 text-sub text-sm">
              もくひょうび を きめると、しどうしゃ が しゅうごと の さくせん を たてる
            </div>
          )}
        </div>

        {/* Learning Roadmap */}
        <div className="card p-6 mb-8">
          <h2 className="font-bold text-base mb-5 text-accent2">&#9733; ぼうけん の ちず</h2>
          <div className="space-y-2">
            {profile.roadmap.map((step, i) => (
              <div key={step.id} className={`flex items-center gap-4 p-3 rounded-xl border ${step.completed ? "border-green/20 bg-green/5" : i === completedSteps ? "border-accent/30 bg-accent/5" : "border-border bg-transparent"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.completed ? "bg-green text-white" : i === completedSteps ? "bg-accent text-white" : "bg-bg2 text-sub"}`}>
                  {step.completed ? "\u2713" : i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-light">約{step.hours}時間</div>
                </div>
                {i === completedSteps && <a href="/learn" className="btn-primary text-xs px-4 py-1.5">学習開始</a>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
