"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import { getProfile, saveProfile, CERTIFICATIONS, TutorPlan, TutorWeek } from "@/lib/store";
import { LESSONS, Lesson, LESSON_LEVELS, LessonLevel } from "@/lib/lessons";
import { recordTopicResult, recordLessonResult, getWeakTopics } from "@/lib/store";
import Mascot from "@/components/Mascot";

interface ChatMsg {
  role: "ai" | "user";
  text: string;
}

async function callAI(mode: string, messages: ChatMsg[], context: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, messages, context }),
  });
  const data = await res.json();
  return data.text;
}

function generateWeeklyPlan(cert: string, goalDate: string, totalHours: number): TutorWeek[] {
  const now = new Date();
  const goal = new Date(goalDate);
  const diffMs = goal.getTime() - now.getTime();
  const totalWeeks = Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));
  const hoursPerWeek = Math.ceil(totalHours / totalWeeks);
  const phases = [
    { phase: "基礎知識のインプット", ratio: 0.25 },
    { phase: "過去問演習（基礎）", ratio: 0.2 },
    { phase: "実技・実践対策", ratio: 0.25 },
    { phase: "過去問演習（応用）", ratio: 0.15 },
    { phase: "模擬試験＆弱点補強", ratio: 0.1 },
    { phase: "最終仕上げ・総復習", ratio: 0.05 },
  ];
  const weeks: TutorWeek[] = [];
  let weekNum = 1;
  for (const t of phases) {
    const n = Math.max(1, Math.round(totalWeeks * t.ratio));
    for (let i = 0; i < n && weekNum <= totalWeeks; i++) {
      const d = new Date(now.getTime() + weekNum * 7 * 24 * 60 * 60 * 1000);
      weeks.push({ week: weekNum, deadline: d.toISOString().split("T")[0], task: `${t.phase}（${cert}）`, hours: hoursPerWeek, done: false });
      weekNum++;
    }
  }
  while (weekNum <= totalWeeks) {
    const d = new Date(now.getTime() + weekNum * 7 * 24 * 60 * 60 * 1000);
    weeks.push({ week: weekNum, deadline: d.toISOString().split("T")[0], task: `総復習（${cert}）`, hours: hoursPerWeek, done: false });
    weekNum++;
  }
  return weeks;
}

function LearnContent() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [watched, setWatched] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [quizPassed, setQuizPassed] = useState(false);
  const [freeChat, setFreeChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasTarget, setHasTarget] = useState(false);
  const [targetCert, setTargetCert] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Tab & Plan state
  const [tab, setTab] = useState<"plan" | "video">("video");
  const [profile, setProfile] = useState(getProfile());
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalDate, setGoalDate] = useState("");
  const [selectedCert, setSelectedCert] = useState("");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [editingWeek, setEditingWeek] = useState<{ planId: string; week: number } | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editHours, setEditHours] = useState("");
  const [aiAdvice, setAiAdvice] = useState<Record<string, string>>({});
  const [adviceLoading, setAdviceLoading] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<LessonLevel | "all">("all");
  const [weakTopics, setWeakTopics] = useState<{ topic: string; correct: number; total: number }[]>([]);

  const allCertLessons = LESSONS.filter((l) => l.cert === targetCert);
  const filteredLessons = levelFilter === "all"
    ? allCertLessons
    : allCertLessons.filter((l) => l.level === levelFilter);

  const searchParams = useSearchParams();

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    const urlCert = searchParams.get("cert");
    const isNewPlan = searchParams.get("newplan") === "1";
    if (isNewPlan && urlCert) {
      setTab("plan");
      setShowGoalForm(true);
      setSelectedCert(urlCert);
    }
    const plans = p.tutorPlans || [];
    const activeCert = urlCert || (plans.length > 0 ? plans[0].cert : null) || p.targetCert;
    if (!activeCert) { setHasTarget(false); return; }
    setHasTarget(true);
    setTargetCert(activeCert);
    if (plans.length > 0) setActivePlanId(plans[0].id);
    const certLessons = LESSONS.filter((l) => l.cert === activeCert);
    const completed = p.completedLessons || [];
    const certTopicNames = [...new Set(certLessons.map((l) => l.topic))];
    const weak = getWeakTopics(activeCert, certTopicNames);

    // Adaptive recommendation: prioritize weak topics, then level order
    let next: Lesson | undefined;
    if (weak.length > 0) {
      for (const wt of weak) {
        const found = certLessons.find((l) => l.topic === wt.topic && !completed.includes(l.id));
        if (found) { next = found; break; }
      }
    }
    if (!next) {
      const levelOrder: LessonLevel[] = ["intro", "basic", "applied", "exam"];
      for (const level of levelOrder) {
        const found = certLessons.find((l) => l.level === level && !completed.includes(l.id));
        if (found) { next = found; break; }
      }
    }
    if (!next) next = certLessons[0];
    if (next) setCurrentLesson(next);
    setWeakTopics(weak);
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleWatch = () => {
    setWatched(true);
    if (currentLesson) {
      setChat([
        {
          role: "ai",
          text: `動画お疲れさまでした！理解度チェックをしましょう。\n\n${currentLesson.quiz.question}`,
        },
      ]);
    }
  };

  const checkAnswer = (userAnswer: string) => {
    if (!currentLesson) return false;
    const matched = currentLesson.quiz.keywords.filter((kw) =>
      userAnswer.includes(kw)
    );
    return matched.length >= 2;
  };

  const handleSend = async () => {
    if (!input.trim() || !currentLesson || loading) return;
    const userMsg: ChatMsg = { role: "user", text: input };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const context = `資格:${currentLesson.cert}, レッスン:${currentLesson.title}, クイズ問題:${currentLesson.quiz.question}, 正解:${currentLesson.quiz.answer}`;

    try {
      if (freeChat) {
        const aiText = await callAI("tutor", newChat, context);
        setChat([...newChat, { role: "ai", text: aiText.replace("[NEXT_LESSON]", "").trim() }]);
        if (aiText.includes("[NEXT_LESSON]")) moveToNext();
      } else {
        const aiText = await callAI("quiz", newChat, context);
        const cleanText = aiText.replace(/\[(CORRECT|INCORRECT)\]/, "").trim();
        setChat([...newChat, { role: "ai", text: cleanText }]);

        if (aiText.includes("[CORRECT]")) {
          const profile = getProfile();
          const completed = [...(profile.completedLessons || []), currentLesson.id];
          saveProfile({
            completedLessons: completed,
            quizCorrect: profile.quizCorrect + 1,
            quizTotal: profile.quizTotal + 1,
            studyHours: profile.studyHours + 2,
          });
          recordTopicResult(currentLesson.topic, true);
          recordLessonResult(currentLesson.id, true);
          setWeakTopics(getWeakTopics(targetCert, [...new Set(allCertLessons.map((l) => l.topic))]));
          setQuizPassed(true);
          setFreeChat(true);
        } else if (aiText.includes("[INCORRECT]")) {
          const profile = getProfile();
          saveProfile({ quizTotal: profile.quizTotal + 1 });
          recordTopicResult(currentLesson.topic, false);
          recordLessonResult(currentLesson.id, false);
          setWeakTopics(getWeakTopics(targetCert, [...new Set(allCertLessons.map((l) => l.topic))]));
        }
      }
    } catch {
      setChat([...newChat, { role: "ai", text: "通信エラーが発生しました。もう一度お試しください。" }]);
    }
    setLoading(false);
  };

  const moveToNext = () => {
    const profile = getProfile();
    const completed = profile.completedLessons || [];
    const next = filteredLessons.find((l) => !completed.includes(l.id));
    if (next) {
      setCurrentLesson(next);
      setWatched(false);
      setChat([]);
      setQuizPassed(false);
      setFreeChat(false);
    }
  };

  // Plan functions
  const plans = profile.tutorPlans || [];
  const activePlan = plans.find((p) => p.id === activePlanId);

  const createPlan = () => {
    if (!goalDate || !selectedCert) return;
    const certInfo = CERTIFICATIONS.find((c) => c.name === selectedCert);
    const weeks = generateWeeklyPlan(selectedCert, goalDate, certInfo?.hours || 100);
    // Add exam tasks at the end
    const lastWeek = weeks.length > 0 ? weeks[weeks.length - 1].week : 0;
    const goalD = new Date(goalDate);
    weeks.push({ week: lastWeek + 1, deadline: goalDate, task: `試験申込み（${selectedCert}）`, hours: 1, done: false });
    const resultDate = new Date(goalD.getTime() + 14 * 86400000);
    weeks.push({ week: lastWeek + 2, deadline: resultDate.toISOString().split("T")[0], task: `受験日（${selectedCert}）`, hours: 0, done: false });
    weeks.push({ week: lastWeek + 3, deadline: new Date(resultDate.getTime() + 30 * 86400000).toISOString().split("T")[0], task: `合否発表（${selectedCert}）`, hours: 0, done: false });
    const plan: TutorPlan = { id: Date.now().toString(), cert: selectedCert, goalDate, createdAt: new Date().toISOString().split("T")[0], weeks, examApplied: false, examResult: null };
    const updated = saveProfile({ tutorPlans: [...plans, plan], targetCert: profile.targetCert || selectedCert, totalHours: profile.totalHours || (certInfo?.hours || 100) });
    setProfile(updated); setActivePlanId(plan.id); setShowGoalForm(false); setGoalDate(""); setSelectedCert("");
  };
  const toggleWeekDone = (planId: string, weekNum: number) => {
    const np = plans.map((p) => p.id !== planId ? p : { ...p, weeks: p.weeks.map((w) => w.week === weekNum ? { ...w, done: !w.done } : w) });
    setProfile(saveProfile({ tutorPlans: np }));
  };
  const deletePlan = (planId: string) => {
    const np = plans.filter((p) => p.id !== planId);
    setProfile(saveProfile({ tutorPlans: np }));
    setActivePlanId(np.length > 0 ? np[0].id : null);
  };
  const saveWeekEdit = () => {
    if (!editingWeek) return;
    const np = plans.map((p) => p.id !== editingWeek.planId ? p : { ...p, weeks: p.weeks.map((w) => w.week === editingWeek.week ? { ...w, task: editTask || w.task, hours: Number(editHours) || w.hours } : w) });
    setProfile(saveProfile({ tutorPlans: np })); setEditingWeek(null);
  };
  const updatePlanGoalDate = (planId: string, newDate: string) => {
    if (!newDate) return;
    const np = plans.map((p) => { if (p.id !== planId) return p; const ci = CERTIFICATIONS.find((c) => c.name === p.cert); return { ...p, goalDate: newDate, weeks: generateWeeklyPlan(p.cert, newDate, ci?.hours || 100) }; });
    setProfile(saveProfile({ tutorPlans: np }));
  };
  const fetchAdvice = async (plan: TutorPlan) => {
    setAdviceLoading(plan.id);
    try {
      const dw = plan.weeks.filter((w) => w.done).length;
      const cw = plan.weeks.find((w) => !w.done);
      const ctx = `資格:${plan.cert}, 目標日:${plan.goalDate}, 進捗:${dw}/${plan.weeks.length}週, 今週:${cw?.task || "なし"}`;
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "tutor", messages: [{ role: "user", text: "今週やるべきことを100文字以内で" }], context: ctx }) });
      const data = await res.json();
      setAiAdvice((prev) => ({ ...prev, [plan.id]: data.text }));
    } catch { setAiAdvice((prev) => ({ ...prev, [plan.id]: "取得失敗" })); }
    setAdviceLoading(null);
  };
  const getDaysLeft = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  const [showCongrats, setShowCongrats] = useState(false);

  const markExamApplied = (planId: string) => {
    const np = plans.map((p) => p.id !== planId ? p : { ...p, examApplied: true });
    setProfile(saveProfile({ tutorPlans: np }));
  };
  const setExamResult = (planId: string, result: "passed" | "failed") => {
    const np = plans.map((p) => p.id !== planId ? p : { ...p, examResult: result });
    setProfile(saveProfile({ tutorPlans: np }));
    if (result === "passed") { setShowCongrats(true); setTimeout(() => setShowCongrats(false), 6000); }
  };

  if (!hasTarget) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-xl font-bold mb-3">学習を始めるには</h1>
          <p className="text-sub text-sm mb-8 leading-relaxed">
            まずはダッシュボードから目指す資格を決めてください。<br />
            業種一覧を見たり、キャリア相談でAIに相談することもできます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/dashboard" className="btn-primary px-6 py-2.5 text-sm">ダッシュボードへ</a>
            <a href="/jobs" className="btn-secondary px-6 py-2.5 text-sm">業種一覧を見る</a>
            <a href="/advisor" className="btn-secondary px-6 py-2.5 text-sm">キャリア相談</a>
          </div>
        </div>
      </div>
    );
  }

  // If no video lessons but plan tab requested, don't block - let plan tab render
  const hasVideoLessons = filteredLessons.length > 0 && currentLesson;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Congratulations overlay */}
      {showCongrats && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 animate-fadeIn" onClick={() => setShowCongrats(false)}>
          <div className="bg-white rounded-2xl p-10 text-center max-w-md mx-4 animate-bounceIn">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-accent2 mb-2">おめでとうございます！</h2>
            <p className="text-sub text-sm mb-4">資格試験に合格しました！<br />あなたの努力が実を結びました。</p>
            <div className="bg-green/10 border border-green/20 rounded-xl p-4 mb-4">
              <div className="text-green font-bold text-lg mb-1">市場価値がアップしました</div>
              <div className="text-sm text-sub">新しいキャリアへの扉が開きました</div>
            </div>
            <button onClick={() => setShowCongrats(false)} className="btn-primary px-8 py-3 text-sm">閉じる</button>
          </div>
          <style jsx>{`
            @keyframes bounceIn { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-bounceIn { animation: bounceIn 0.5s ease; }
            .animate-fadeIn { animation: fadeIn 0.3s ease; }
          `}</style>
        </div>
      )}
      <Nav />
      {/* Tab bar */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <span className="text-xs text-sub py-2">学習中: <span className="font-medium text-accent">{targetCert}</span></span>
          <div className="flex gap-1 ml-auto">
            <button onClick={() => setTab("plan")} className={`px-3 py-2 text-xs font-medium border-b-2 transition ${tab === "plan" ? "border-accent text-accent" : "border-transparent text-sub hover:text-text"}`}>プラン</button>
            <button onClick={() => setTab("video")} className={`px-3 py-2 text-xs font-medium border-b-2 transition ${tab === "video" ? "border-accent text-accent" : "border-transparent text-sub hover:text-text"}`}>動画学習</button>
          </div>
        </div>
      </div>

      {tab === "plan" ? (
        <div className="max-w-4xl mx-auto w-full px-6 py-6">
          {/* Plan management */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base">学習プラン</h2>
            <button onClick={() => setShowGoalForm(!showGoalForm)} className="btn-primary text-xs px-4 py-1.5">{showGoalForm ? "閉じる" : "新しいプランを作成"}</button>
          </div>
          {showGoalForm && (
            <div className="card p-5 mb-5 space-y-4">
              <div className="text-sm font-medium">新しい学習プランを作成</div>
              <div>
                <label className="block text-xs text-sub mb-2">目指す資格</label>
                <div className="grid grid-cols-2 gap-2">
                  {CERTIFICATIONS.map((c) => (
                    <button key={c.name} onClick={() => setSelectedCert(c.name)} className={`text-left p-3 rounded-lg border text-xs transition ${selectedCert === c.name ? "border-accent bg-accent/5" : "border-border bg-white hover:border-accent/50"}`}>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sub mt-0.5">月給{c.salary}万円 / {c.hours}時間</div>
                    </button>
                  ))}
                </div>
              </div>
              {selectedCert && (() => { const c = CERTIFICATIONS.find((x) => x.name === selectedCert); return c ? <div className="bg-green/5 border border-green/20 rounded-lg p-4"><div className="text-xs font-semibold text-green mb-1">この資格を取ると...</div><div className="text-sm">{c.future}</div></div> : null; })()}
              <div>
                <label className="block text-xs text-sub mb-2">目標日</label>
                {/* Suggested dates */}
                {selectedCert && (() => {
                  const ci = CERTIFICATIONS.find((c) => c.name === selectedCert);
                  const hours = ci?.hours || 100;
                  const now = Date.now();
                  const d = (months: number) => new Date(now + months * 30 * 86400000).toISOString().split("T")[0];
                  const suggestions = hours <= 50 ? [
                    { label: "短期集中（1ヶ月）", date: d(1), desc: "毎日2時間ペース" },
                    { label: "おすすめ（2ヶ月）", date: d(2), desc: "毎日1時間ペース" },
                    { label: "ゆったり（3ヶ月）", date: d(3), desc: "週5時間ペース" },
                  ] : hours <= 100 ? [
                    { label: "短期集中（2ヶ月）", date: d(2), desc: "毎日2時間ペース" },
                    { label: "おすすめ（3ヶ月）", date: d(3), desc: "毎日1時間ペース" },
                    { label: "ゆったり（5ヶ月）", date: d(5), desc: "週5時間ペース" },
                  ] : [
                    { label: "短期集中（3ヶ月）", date: d(3), desc: "毎日2時間ペース" },
                    { label: "おすすめ（5ヶ月）", date: d(5), desc: "毎日1時間ペース" },
                    { label: "ゆったり（8ヶ月）", date: d(8), desc: "週5時間ペース" },
                  ];
                  return (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {suggestions.map((s) => (
                        <button key={s.label} onClick={() => setGoalDate(s.date)}
                          className={`p-2.5 rounded-lg border text-left text-xs transition ${goalDate === s.date ? "border-accent bg-accent/5" : "border-border bg-white hover:border-accent/40"}`}>
                          <div className="font-medium">{s.label}</div>
                          <div className="text-sub mt-0.5">{s.desc}</div>
                          <div className="text-[10px] text-light mt-0.5">〜{s.date}</div>
                        </button>
                      ))}
                    </div>
                  );
                })()}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] text-sub mb-1">自分で日付を選ぶ</label>
                    <input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <button onClick={createPlan} disabled={!goalDate || !selectedCert} className="btn-primary px-5 py-2 text-sm disabled:opacity-40">プランを作成</button>
                </div>
              </div>
            </div>
          )}
          {plans.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {plans.map((p) => <button key={p.id} onClick={() => setActivePlanId(p.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition ${activePlanId === p.id ? "bg-accent/10 text-accent" : "bg-bg2 text-sub"}`}>{p.cert}（〜{p.goalDate}）</button>)}
            </div>
          )}
          {activePlan && (() => {
            const daysLeft = getDaysLeft(activePlan.goalDate);
            const doneWeeks = activePlan.weeks.filter((w) => w.done).length;
            const planProgress = Math.round((doneWeeks / activePlan.weeks.length) * 100);
            const currentWeekIdx = activePlan.weeks.findIndex((w) => !w.done);
            return (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium">{activePlan.cert}</div>
                    <div className="text-xs text-sub flex items-center gap-2">
                      <span>目標:</span>
                      <input type="date" value={activePlan.goalDate} onChange={(e) => updatePlanGoalDate(activePlan.id, e.target.value)} className="bg-transparent border-b border-border text-xs px-1 py-0.5 focus:outline-none focus:border-accent" />
                      <span>（残り<span className={daysLeft <= 14 ? "text-red font-medium" : daysLeft <= 30 ? "text-orange font-medium" : "text-green font-medium"}>{daysLeft}日</span>）</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right"><div className="text-lg font-black text-accent">{planProgress}%</div><div className="text-[10px] text-sub">{doneWeeks}/{activePlan.weeks.length}週</div></div>
                    <button onClick={() => deletePlan(activePlan.id)} className="text-xs text-light hover:text-red">削除</button>
                  </div>
                </div>
                {(() => { const ci = CERTIFICATIONS.find((c) => c.name === activePlan.cert); return ci ? <div className="bg-green/5 border border-green/20 rounded-lg p-3 mb-4"><div className="text-[11px] font-semibold text-green mb-0.5">この資格を取ると...</div><div className="text-xs">{ci.future}</div></div> : null; })()}
                <div className="bg-bg2 rounded-full h-2 overflow-hidden mb-4"><div className="h-full rounded-full transition-all" style={{ width: `${planProgress}%`, background: "#635bff" }} /></div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-accent">家庭教師からのアドバイス</div>
                    <button onClick={() => fetchAdvice(activePlan)} disabled={adviceLoading === activePlan.id} className="text-[11px] text-accent hover:underline disabled:opacity-50">{adviceLoading === activePlan.id ? "取得中..." : "更新"}</button>
                  </div>
                  <Mascot message={aiAdvice[activePlan.id] || "「更新」を押すとアドバイスをお伝えします！"} mood={adviceLoading === activePlan.id ? "thinking" : doneWeeks > activePlan.weeks.length / 2 ? "cheer" : "happy"} size={55} />
                </div>
                <div className="space-y-1.5">
                  {activePlan.weeks.map((w, i) => {
                    const isPast = new Date(w.deadline) < new Date() && !w.done;
                    const isCurrent = i === currentWeekIdx;
                    return (
                      <div key={w.week} className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-pointer hover:shadow-sm transition ${w.done ? "border-green/20 bg-green/5" : isCurrent ? "border-accent/30 bg-accent/5" : isPast ? "border-red/20 bg-red/5" : "border-border"}`}
                        onClick={() => { if (!w.task.includes("試験申込") && !w.task.includes("受験日") && !w.task.includes("合否発表")) { setTab("video"); } }}>
                        <button onClick={(e) => { e.stopPropagation(); toggleWeekDone(activePlan.id, w.week); }} className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 border ${w.done ? "bg-green text-white border-green" : "border-border hover:border-accent"}`}>{w.done && "\u2713"}</button>
                        <div className="flex-1 min-w-0">
                          {editingWeek?.planId === activePlan.id && editingWeek?.week === w.week ? (
                            <div className="flex gap-2 items-center">
                              <input value={editTask} onChange={(e) => setEditTask(e.target.value)} className="flex-1 bg-white border border-border rounded px-2 py-1 text-xs" />
                              <input type="number" value={editHours} onChange={(e) => setEditHours(e.target.value)} className="w-14 bg-white border border-border rounded px-2 py-1 text-xs" />
                              <button onClick={saveWeekEdit} className="text-xs text-accent font-medium">保存</button>
                              <button onClick={() => setEditingWeek(null)} className="text-xs text-sub">取消</button>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium text-[13px] truncate">
                                {w.task.includes("試験申込") ? "📋 " : w.task.includes("受験日") ? "📝 " : w.task.includes("合否発表") ? "🎯 " : ""}
                                Week {w.week}: {w.task}
                              </div>
                              <div className="text-xs text-sub flex items-center gap-1 flex-wrap">
                                期限: {w.deadline}{w.hours > 0 ? ` / ${w.hours}h` : ""}
                                {isPast && <span className="text-red">（超過）</span>}
                                {isCurrent && <span className="text-accent">（今週）</span>}
                                {/* Exam apply link */}
                                {w.task.includes("試験申込") && !activePlan.examApplied && (() => {
                                  const ci = CERTIFICATIONS.find((c) => c.name === activePlan.cert);
                                  return ci?.examUrl ? (
                                    <a href={ci.examUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1" onClick={(e) => { e.stopPropagation(); markExamApplied(activePlan.id); }}>
                                      試験に申し込む →
                                    </a>
                                  ) : null;
                                })()}
                                {w.task.includes("試験申込") && activePlan.examApplied && <span className="text-green ml-1">申込済み</span>}
                                {/* Exam result buttons */}
                                {w.task.includes("合否発表") && !activePlan.examResult && (
                                  <span className="flex gap-1 ml-1">
                                    <button onClick={() => setExamResult(activePlan.id, "passed")} className="px-2 py-0.5 bg-green/10 text-green border border-green/20 rounded text-[11px] hover:bg-green/20">合格</button>
                                    <button onClick={() => setExamResult(activePlan.id, "failed")} className="px-2 py-0.5 bg-red/10 text-red border border-red/20 rounded text-[11px] hover:bg-red/20">不合格</button>
                                  </span>
                                )}
                                {w.task.includes("合否発表") && activePlan.examResult === "passed" && <span className="text-green font-medium ml-1">合格!</span>}
                                {w.task.includes("合否発表") && activePlan.examResult === "failed" && <span className="text-red ml-1">次回リベンジ</span>}
                                {!w.task.includes("試験申込") && !w.task.includes("受験日") && !w.task.includes("合否発表") && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); setTab("video"); }} className="text-accent hover:underline ml-1">学習する</button>
                                    <button onClick={(e) => { e.stopPropagation(); setEditingWeek({ planId: activePlan.id, week: w.week }); setEditTask(w.task); setEditHours(String(w.hours)); }} className="text-light hover:text-accent ml-1">編集</button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          {plans.length === 0 && !showGoalForm && <div className="text-center py-12 text-sub text-sm">目標日を設定すると、週ごとの学習プランを自動作成します</div>}

          {/* Roadmap */}
          {profile.roadmap.length > 0 && (
            <div className="card p-5 mt-6">
              <h2 className="font-bold text-sm mb-4">学習ロードマップ</h2>
              <div className="space-y-1.5">
                {profile.roadmap.map((step, i) => {
                  const cs = profile.roadmap.filter((r) => r.completed).length;
                  return (
                    <div key={step.id} className={`flex items-center gap-3 p-2.5 rounded-lg border ${step.completed ? "border-green/20 bg-green/5" : i === cs ? "border-accent/30 bg-accent/5" : "border-border"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step.completed ? "bg-green text-white" : i === cs ? "bg-accent text-white" : "bg-bg2 text-sub"}`}>{step.completed ? "\u2713" : i + 1}</div>
                      <div className="flex-1"><div className="text-[13px] font-medium">{step.title}</div><div className="text-[11px] text-light">約{step.hours}h</div></div>
                      {i === cs && <button onClick={() => setTab("video")} className="btn-primary text-xs px-3 py-1">学習開始</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : !hasVideoLessons ? (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-xl font-bold mb-3">{targetCert}の動画教材</h1>
        <p className="text-sub text-sm mb-8">この資格の動画教材は現在準備中です。<br />「プラン」タブから学習プランの作成ができます。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setTab("plan")} className="btn-primary px-6 py-2.5 text-sm">プランタブへ</button>
          <a href="/advisor" className="btn-secondary px-6 py-2.5 text-sm">入学相談</a>
        </div>
      </div>
      ) : (
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Video Area */}
        <div className="lg:w-3/5 p-4">
          <div className="card overflow-hidden">
            <div className="aspect-video bg-black relative">
              <iframe
                src={`https://www.youtube.com/embed/${currentLesson.videoId}?rel=0`}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              {!watched && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-center">
                  <button onClick={handleWatch} className="btn-primary px-6 py-2 text-sm">
                    視聴完了 → 理解度チェックへ
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-bold">{currentLesson.title}</h2>
              <div className="flex gap-3 mt-1">
                <span className="text-sub text-sm">{currentLesson.cert}</span>
                <span className="text-light text-sm">約{currentLesson.duration}分</span>
              </div>
            </div>
          </div>

          {/* Weak Topics Alert */}
          {weakTopics.length > 0 && (
            <div className="card p-4 mt-4 border-orange-200 bg-orange-50">
              <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">弱点分野</h3>
              <p className="text-[11px] text-orange-600 mb-2">以下の分野の正答率が低めです。重点的に復習しましょう。</p>
              <div className="flex flex-wrap gap-1.5">
                {weakTopics.map((wt) => (
                  <span key={wt.topic} className="text-[11px] px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                    {wt.topic} ({Math.round((wt.correct / wt.total) * 100)}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4 mt-4">
            <h3 className="text-xs text-sub uppercase tracking-wider mb-3">Lessons</h3>
            {/* Level filter */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
              <button
                onClick={() => setLevelFilter("all")}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition ${levelFilter === "all" ? "bg-accent text-white" : "bg-bg2 text-sub border border-border hover:text-text"}`}
              >
                すべて
              </button>
              {LESSON_LEVELS.map((lv) => {
                const count = allCertLessons.filter((l) => l.level === lv.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={lv.id}
                    onClick={() => setLevelFilter(lv.id)}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition ${levelFilter === lv.id ? "bg-accent text-white" : `${lv.color} border`}`}
                  >
                    {lv.label} ({count})
                  </button>
                );
              })}
            </div>
            {filteredLessons.map((l) => {
              const profile = typeof window !== "undefined" ? getProfile() : { completedLessons: [] as number[], topicScores: [] as { topic: string; correct: number; total: number }[] };
              const done = (profile.completedLessons || []).includes(l.id);
              const levelInfo = LESSON_LEVELS.find((lv) => lv.id === l.level);
              const isWeak = weakTopics.some((wt) => wt.topic === l.topic);
              return (
                <div
                  key={l.id}
                  className={`flex items-center gap-3 py-2.5 border-b border-border last:border-0 text-sm cursor-pointer hover:bg-bg2/50 transition ${l.id === currentLesson.id ? "text-accent font-medium" : "text-sub"}`}
                  onClick={() => { setCurrentLesson(l); setWatched(false); setChat([]); setQuizPassed(false); setFreeChat(false); }}
                >
                  <span className={done ? "text-green" : "text-light"}>{done ? "\u2713" : "\u25CB"}</span>
                  <span className="flex-1">
                    {l.title}
                    {isWeak && <span className="ml-1 text-orange-500 text-[10px]">要復習</span>}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${levelInfo?.color || ""}`}>{levelInfo?.label}</span>
                  <span className="text-xs text-light flex-shrink-0">{l.duration}分</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:w-2/5 flex flex-col border-l border-border">
          <div className="border-b border-border py-3 px-4 text-sm font-medium text-sub flex items-center gap-2">
            家庭教師
            {!watched && <span className="ml-auto text-xs text-light">動画視聴後に開始</span>}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
            {!watched ? (
              <div className="text-center text-sub text-sm mt-12">
                まず動画を視聴してください。<br />
                <span className="text-light">視聴後、理解度チェックを行います。</span>
              </div>
            ) : (
              chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-accent text-white rounded-br-sm" : "card rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="card rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-sub">考え中...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {watched && (
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={quizPassed ? "質問を入力 or「次へ」" : "回答を入力..."} disabled={loading}
                  className="flex-1 bg-bg2 border border-border rounded-full px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50" />
                <button onClick={handleSend} disabled={loading} className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50">送信</button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sub text-sm">読み込み中...</div>}>
      <LearnContent />
    </Suspense>
  );
}
