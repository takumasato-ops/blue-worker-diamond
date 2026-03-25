"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, CERTIFICATIONS, RoadmapStep } from "@/lib/store";

type Step = "form" | "chat" | "result";

interface Message {
  role: "ai" | "user";
  text: string;
}

async function callAI(messages: Message[], context: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "onboarding", messages, context }),
  });
  const data = await res.json();
  return data.text;
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", age: "", currentJob: "", skills: "", desiredSalary: "" });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<typeof CERTIFICATIONS[0] | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const userContext = `名前:${form.name}, 年齢:${form.age}歳, 現職:${form.currentJob}, スキル:${form.skills}, 希望年収:${form.desiredSalary}万円`;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({
      name: form.name,
      age: Number(form.age),
      currentJob: form.currentJob,
      skills: form.skills.split(",").map((s) => s.trim()),
      desiredSalary: Number(form.desiredSalary),
    });
    setStep("chat");
    setLoading(true);
    const firstMsg: Message = { role: "user", text: `プロフィール: ${userContext}\n最適な資格を提案してください。` };
    try {
      const aiText = await callAI([firstMsg], userContext);
      setMessages([{ role: "ai", text: aiText }]);
    } catch {
      setMessages([{ role: "ai", text: `${form.name}さん、はじめまして！AIキャリアアドバイザーです。\n\n現在${form.currentJob}をされているんですね。希望年収${form.desiredSalary}万円を目指して、最適な資格を見つけましょう！\n\nまず、体を動かす仕事と、現場監督のような管理系の仕事、どちらに興味がありますか？` }]);
    }
    setLoading(false);
  };

  const [selectedCert, setSelectedCert] = useState<typeof CERTIFICATIONS[0] | null>(null);

  const confirmCert = () => {
    if (!selectedCert) return;
    const cert = selectedCert;
    const roadmap: RoadmapStep[] = [
      { id: 1, title: "基礎理論の学習", hours: Math.round(cert.hours * 0.25), completed: false },
      { id: 2, title: "過去問演習（前半）", hours: Math.round(cert.hours * 0.2), completed: false },
      { id: 3, title: "実技・実践対策", hours: Math.round(cert.hours * 0.3), completed: false },
      { id: 4, title: "過去問演習（後半）", hours: Math.round(cert.hours * 0.15), completed: false },
      { id: 5, title: "模擬試験＆最終仕上げ", hours: Math.round(cert.hours * 0.1), completed: false },
    ];
    saveProfile({ targetCert: cert.name, roadmap, totalHours: cert.hours, marketValue: 22 });
    setRecommended(cert);
    setStep("result");
  };

  const handleChat = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const aiText = await callAI(newMessages, userContext);
      const aiMsg: Message = { role: "ai", text: aiText.replace(/\[RECOMMEND:.+?\]/, "").trim() };
      setMessages([...newMessages, aiMsg]);
    } catch {
      setMessages([...newMessages, { role: "ai", text: "通信エラーが発生しました。もう一度お試しください。" }]);
    }
    setLoading(false);
  };

  if (step === "result" && recommended) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-lg w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">ロードマップ完成</h2>
          <p className="text-sub mb-6">{recommended.name}の取得に向けた個別最適化プラン</p>
          <div className="bg-bg2 rounded-xl p-4 mb-6 text-left">
            <div className="text-xs text-sub mb-3 uppercase tracking-wider">Learning Steps</div>
            {["基礎理論の学習", "過去問演習（前半）", "実技・実践対策", "過去問演習（後半）", "模擬試験＆最終仕上げ"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">{i + 1}</div>
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push("/dashboard")} className="btn-primary px-8 py-3 w-full">
            ダッシュボードへ進む
          </button>
        </div>
      </div>
    );
  }

  if (step === "chat") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="border-b border-border py-3 px-4 text-center text-sm font-medium text-sub">キャリアアドバイザー</div>
        <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-accent text-white rounded-br-sm" : "card rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="card rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-sub">考え中...</div>
            </div>
          )}
          {/* Cert selection - only after 4+ messages */}
          {messages.length >= 4 && !loading && (
            <div className="mt-4 p-4 bg-bg2 rounded-xl">
              <div className="text-xs text-sub mb-2">目指す資格を選択してください</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {CERTIFICATIONS.map((c) => (
                  <button key={c.name} onClick={() => setSelectedCert(c)}
                    className={`text-xs px-3 py-1.5 rounded-md border transition ${
                      selectedCert?.name === c.name
                        ? "border-accent bg-accent/10 text-accent font-medium"
                        : "border-border bg-white hover:border-accent/50 text-sub"
                    }`}>
                    {c.name}
                  </button>
                ))}
              </div>
              {selectedCert && (
                <div>
                  <div className="text-xs text-sub mb-2">
                    {selectedCert.name} — 月給{selectedCert.salary}万円 / 学習{selectedCert.hours}時間 / 需要: {selectedCert.demand}
                  </div>
                  <button onClick={confirmCert} className="btn-primary w-full py-2.5 text-sm">
                    この資格で次に進む
                  </button>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-border">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleChat()} placeholder="メッセージを入力..." disabled={loading}
              className="flex-1 bg-bg2 border border-border rounded-full px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50" />
            <button onClick={handleChat} disabled={loading} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">
              送信
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">あなたについて教えてください</h1>
          <p className="text-sub text-sm mt-2">最適なキャリアプランを設計します</p>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {[
            { key: "name", label: "お名前", type: "text", ph: "山田太郎" },
            { key: "age", label: "年齢", type: "number", ph: "35" },
            { key: "currentJob", label: "現在の職種", type: "text", ph: "営業事務" },
            { key: "skills", label: "スキル・経験（カンマ区切り）", type: "text", ph: "Excel, 普通免許" },
            { key: "desiredSalary", label: "希望年収（万円）", type: "number", ph: "450" },
          ].map(({ key, label, type, ph }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-sub mb-1.5">{label}</label>
              <input type={type} required placeholder={ph} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-light" />
            </div>
          ))}
          <button type="submit" className="w-full btn-primary py-3 mt-2">
            ヒアリングを開始
          </button>
        </form>
      </div>
    </div>
  );
}
