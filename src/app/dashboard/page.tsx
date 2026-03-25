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
            <h1 className="text-2xl font-bold mb-2">ようこそ</h1>
            <p className="text-sub">まずは気になる職業を探してみましょう</p>
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
        {/* AI Message */}
        <div className="card p-5 mb-8">
          <div className="text-xs text-sub uppercase tracking-wider mb-2">Today&apos;s Message</div>
          <div className="text-sm text-text">{message}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="text-sub text-xs mb-3">推定市場価値</div>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black gradient-text">{currentValue}</span>
              <span className="text-sm text-sub mb-1">万円/月</span>
            </div>
            <div className="mt-3 text-xs text-green font-medium">+{currentValue - 22}万円 UP</div>
          </div>
          <div className="card p-6">
            <div className="text-sub text-xs mb-3">{profile.targetCert}</div>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black text-text">{progress}</span>
              <span className="text-sm text-sub mb-1">%</span>
            </div>
            <div className="mt-3 bg-bg2 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "#635bff" }} />
            </div>
            <div className="mt-2 text-xs text-sub">残り{remainHours}時間</div>
          </div>
          <div className="card p-6">
            <div className="text-sub text-xs mb-3">正答率</div>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black text-green">
                {profile.quizTotal > 0 ? Math.round((profile.quizCorrect / profile.quizTotal) * 100) : 0}
              </span>
              <span className="text-sm text-sub mb-1">%</span>
            </div>
            <div className="mt-3 text-xs text-sub">{profile.quizCorrect}/{profile.quizTotal} 問正解</div>
          </div>
        </div>

        {/* Tutor Plans */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base">学習プラン</h2>
            <button onClick={() => setShowGoalForm(!showGoalForm)} className="btn-primary text-xs px-4 py-1.5">
              {showGoalForm ? "閉じる" : "新しいプランを作成"}
            </button>
          </div>

          {/* Goal Form */}
          {showGoalForm && (
            <div className="bg-bg2 rounded-xl p-4 mb-5">
              <div className="text-sm font-medium mb-3">いつまでに{profile.targetCert}を取得しますか？</div>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-sub mb-1">目標日</label>
                  <input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <button onClick={createPlan} disabled={!goalDate} className="btn-primary px-5 py-2 text-sm disabled:opacity-40">
                  AIがプランを作成
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
                        <div className="text-xs font-semibold text-accent">家庭教師からのアドバイス</div>
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
              目標日を設定すると、AIが週ごとの学習プランを自動作成します
            </div>
          )}
        </div>

        {/* Learning Roadmap */}
        <div className="card p-6 mb-8">
          <h2 className="font-bold text-base mb-5">学習ロードマップ</h2>
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
