"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import { getProfile, saveProfile } from "@/lib/store";
import { LESSONS, Lesson } from "@/lib/lessons";

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

export default function LearnPage() {
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

  const filteredLessons = LESSONS.filter((l) => l.cert === targetCert);

  useEffect(() => {
    const profile = getProfile();
    if (!profile.targetCert) {
      setHasTarget(false);
      return;
    }
    setHasTarget(true);
    setTargetCert(profile.targetCert);
    const certLessons = LESSONS.filter((l) => l.cert === profile.targetCert);
    const completed = profile.completedLessons || [];
    const next = certLessons.find((l) => !completed.includes(l.id)) || certLessons[0];
    if (next) setCurrentLesson(next);
  }, []);

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
          setQuizPassed(true);
          setFreeChat(true);
        } else if (aiText.includes("[INCORRECT]")) {
          const profile = getProfile();
          saveProfile({ quizTotal: profile.quizTotal + 1 });
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

  if (!currentLesson) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
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

          <div className="card p-4 mt-4">
            <h3 className="text-xs text-sub uppercase tracking-wider mb-3">Lessons</h3>
            {filteredLessons.map((l) => {
              const profile = typeof window !== "undefined" ? getProfile() : { completedLessons: [] as number[] };
              const done = (profile.completedLessons || []).includes(l.id);
              return (
                <div key={l.id} className={`flex items-center gap-3 py-2.5 border-b border-border last:border-0 text-sm ${l.id === currentLesson.id ? "text-accent font-medium" : "text-sub"}`}>
                  <span className={done ? "text-green" : "text-light"}>{done ? "\u2713" : "\u25CB"}</span>
                  <span className="flex-1">{l.title}</span>
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
    </div>
  );
}
