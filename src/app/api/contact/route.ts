import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    // Send email notification to Canal AI via Gmail
    // For now, log and store. Can integrate with SendGrid/Resend/Gmail API later.
    const notification = {
      to: "takuma.sato@canal-ai.com",
      subject: `【BWD】キャリア相談のお問い合わせ: ${name}様`,
      body: `
キャリア相談の問い合わせがありました。

■ お名前: ${name}
■ メール: ${email}
■ 電話番号: ${phone || "未入力"}
■ 相談内容:
${message}

---
Blue Worker Diamond
      `.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("Contact notification:", JSON.stringify(notification));

    // If Google Chat webhook is configured, send there
    const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*【BWD キャリア相談】*\n名前: ${name}\nメール: ${email}\n電話: ${phone || "未入力"}\n相談内容: ${message}`,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
