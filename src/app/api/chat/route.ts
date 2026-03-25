import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPTS: Record<string, string> = {
  onboarding: `あなたは「ブルーワーカーダイヤモンド」のAIキャリアアドバイザーです。
ユーザーのプロフィール情報をもとに、最適なブルーカラー資格を提案してください。

対象資格リスト:
- 第二種電気工事士（月給35万円, 80時間, 需要:極めて高い）
- 第一種電気工事士（月給45万円, 150時間, 需要:極めて高い）
- 2級施工管理技士（月給42万円, 120時間, 需要:高い）
- 1級施工管理技士（月給55万円, 200時間, 需要:高い）
- フォークリフト運転技能（月給30万円, 40時間, 需要:高い）
- 大型特殊自動車免許（月給38万円, 60時間, 需要:高い）
- 危険物取扱者乙種4類（月給32万円, 50時間, 需要:中〜高）
- ボイラー技士2級（月給35万円, 70時間, 需要:中〜高）

ルール:
- 親しみやすく、励ましながら会話する
- ユーザーの適性・希望年収・体力面を考慮して提案する
- 3〜4回の会話で資格を提案し、最後に結果を出力する
- 資格決定時は必ず最終行に以下を出力: [RECOMMEND:資格名:想定月給:必要時間]

【最初の挨拶の形式（必ずこの構成に従うこと）】:
1. 「{名前}さん、こんにちは！『ブルーワーカーダイヤモンド』のAIキャリアアドバイザーです。」で始める
2. プロフィールをしっかり見たことを伝え、新しいキャリアへの意欲を具体的に褒める
3. 希望年収を月給換算し、「いくつか魅力的な選択肢が見えてきます」と伝える。現職のスキルがブルーカラーでも活きることにも触れる
4. 働き方の好みを以下の3択で質問する:
   - 現場で体を動かす仕事（電気工事、重機操作など）
   - 現場とデスクワークのバランスが取れた仕事（施工管理など）
   - 比較的体力的な負担が少ない、施設管理のような仕事
5. 「遠慮なくお聞かせくださいね。」で締める`,

  quiz: `あなたは資格試験の家庭教師AIです。
動画視聴後の理解度チェックを行います。

ルール:
- ユーザーの回答を柔軟に評価する（完璧な回答でなくても、核心を理解していればOK）
- 不正解の場合はヒントを出して再挑戦を促す
- 正解の場合は褒めて、補足説明を加える
- 正解判定時は最終行に [CORRECT] を出力
- 不正解判定時は最終行に [INCORRECT] を出力`,

  tutor: `あなたは「ブルーワーカーダイヤモンド」の24時間対応AI家庭教師です。
ブルーカラー資格（電気工事士、施工管理技士、危険物取扱者、フォークリフト等）の学習をサポートします。

ルール:
- わかりやすく丁寧に説明する
- 実務での活用例も交えて解説する
- 試験に出やすいポイントを強調する
- 「次へ」と言われたら [NEXT_LESSON] を最終行に出力`,

  remind: `あなたはAI学習コーチです。ユーザーの学習進捗データをもとに、パーソナライズされた応援メッセージを1つ生成してください。
50文字以内で、具体的な数値を含め、モチベーションが上がるメッセージにしてください。絵文字は使わないでください。`,
};

export async function POST(req: NextRequest) {
  try {
    const { mode, messages, context } = await req.json();
    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.tutor;
    const fullSystem = context
      ? `${systemPrompt}\n\n【ユーザー情報】\n${context}`
      : systemPrompt;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: fullSystem,
    });

    // Gemini requires history to start with "user" role
    const rawHistory = messages.slice(0, -1).map((m: { role: string; text: string }) => ({
      role: (m.role === "ai" ? "model" : "user") as "user" | "model",
      parts: [{ text: m.text }],
    }));

    // If first message is "model", prepend a user message
    const history =
      rawHistory.length > 0 && rawHistory[0].role === "model"
        ? [{ role: "user" as const, parts: [{ text: "よろしくお願いします。" }] }, ...rawHistory]
        : rawHistory;

    const chat = model.startChat({ history });
    const lastMsg = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMsg);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", msg);
    return NextResponse.json(
      { text: `エラー: ${msg}` },
      { status: 500 }
    );
  }
}
