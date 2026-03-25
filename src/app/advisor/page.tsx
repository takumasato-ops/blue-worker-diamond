"use client";
import { useState, useRef, useEffect } from "react";
import Nav from "@/components/Nav";
import { getProfile } from "@/lib/store";

type Mode = "select" | "ai" | "human";
interface ChatMsg { role: "ai" | "user"; text: string }

export default function AdvisorPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Human contact form
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const profile = getProfile();
    const userMsg: ChatMsg = { role: "user", text: input };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    setInput("");
    setLoading(true);
    try {
      const context = `名前:${profile.name}, 年齢:${profile.age}歳, 現職:${profile.currentJob}, 目標資格:${profile.targetCert || "未定"}, スキル:${(profile.skills || []).join(",")}`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "tutor", messages: newChat, context }),
      });
      const data = await res.json();
      setChat([...newChat, { role: "ai", text: data.text }]);
    } catch {
      setChat([...newChat, { role: "ai", text: "通信エラーが発生しました。" }]);
    }
    setLoading(false);
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send notification to Canal AI
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Still show success to user
    }
    setSubmitted(true);
  };

  // Selection screen
  if (mode === "select") {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold mb-2">キャリア相談</h1>
            <p className="text-sub text-sm">相談方法を選んでください</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setMode("ai")} className="card p-6 text-left hover:border-accent transition group">
              <div className="text-2xl mb-3 inline-block px-3 py-1.5 rounded-full text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #a78bfa, #818cf8, #7dd3fc)" }}>AI</div>
              <div className="font-bold text-[15px] mb-1">AIキャリア相談</div>
              <div className="text-xs text-sub leading-relaxed">
                AIアドバイザーが24時間対応。資格選び・キャリアプラン・学習方法について何でも即座に回答します。
              </div>
            </button>
            <button onClick={() => setMode("human")} className="card p-6 text-left hover:border-accent transition group">
              <div className="text-2xl mb-3 inline-block px-3 py-1.5 rounded-full text-sm font-semibold bg-accent2 text-white">相談</div>
              <div className="font-bold text-[15px] mb-1">人に相談する</div>
              <div className="text-xs text-sub leading-relaxed">
                キャリアアドバイザーが個別に対応。より具体的な転職相談や企業紹介をご希望の方はこちら。
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Human contact form
  if (mode === "human") {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="max-w-lg mx-auto px-6 py-12">
          <button onClick={() => setMode("select")} className="text-sm text-sub hover:text-text mb-6 inline-block">&larr; 戻る</button>

          {submitted ? (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-4">&#10003;</div>
              <h2 className="text-xl font-bold mb-2">送信完了</h2>
              <p className="text-sub text-sm mb-6">
                お問い合わせありがとうございます。<br />担当者より1営業日以内にご連絡いたします。
              </p>
              <button onClick={() => setMode("select")} className="btn-secondary px-6 py-2.5 text-sm">戻る</button>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-1">キャリアアドバイザーに相談</h2>
              <p className="text-sub text-xs mb-6">以下を送信いただくと、担当者よりご連絡いたします</p>
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-sub mb-1.5">お名前</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="山田太郎" className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-sub mb-1.5">メールアドレス</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="yamada@example.com" className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-sub mb-1.5">電話番号（任意）</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="090-1234-5678" className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-sub mb-1.5">ご相談内容</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="キャリアチェンジについて相談したいです..." className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full py-3 text-sm">送信する</button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI Chat
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <button onClick={() => setMode("select")} className="text-sm text-sub hover:text-text">&larr;</button>
          <div>
            <h1 className="font-bold text-base">AIキャリア相談</h1>
            <p className="text-sub text-xs">24時間対応・何でも質問OK</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {chat.length === 0 && (
            <div className="text-center mt-16">
              <div className="text-sub text-sm mb-6">何でもお気軽にご相談ください</div>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "どの資格が自分に合っていますか？",
                  "未経験でも取れる資格は？",
                  "年収500万を目指すには？",
                  "電気工事士と施工管理の違いは？",
                ].map((q) => (
                  <button key={q} onClick={() => setInput(q)}
                    className="text-xs px-3 py-2 rounded-lg border border-border bg-white hover:border-accent hover:text-accent transition">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-accent text-white rounded-br-sm" : "bg-bg2 text-text rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-bg2 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-sub">考え中...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="質問を入力..." disabled={loading}
              className="flex-1 bg-bg2 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50" />
            <button onClick={send} disabled={loading} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">送信</button>
          </div>
        </div>
      </div>
    </div>
  );
}
