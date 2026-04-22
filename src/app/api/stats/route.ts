import { NextRequest, NextResponse } from "next/server";
import { LESSONS } from "@/lib/lessons";
import { CERTIFICATIONS } from "@/lib/store";
import { JOB_CATEGORIES } from "@/lib/jobs";

export async function GET(req: NextRequest) {
  // API key check for external access (Google Apps Script etc.)
  const apiKey = req.nextUrl.searchParams.get("key");
  const expectedKey = process.env.STATS_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const stats = {
    service: "Blue Worker Diamond",
    generatedAt: now.toISOString(),
    date: now.toISOString().split("T")[0],

    // Product metrics
    product: {
      totalLessons: LESSONS.length,
      totalCertifications: CERTIFICATIONS.length,
      totalJobCategories: JOB_CATEGORIES.length,
      totalJobs: JOB_CATEGORIES.reduce((sum, c) => sum + c.jobs.length, 0),
      lessonsByCert: CERTIFICATIONS.map((cert) => ({
        cert: cert.name,
        lessons: LESSONS.filter((l) => l.cert === cert.name).length,
        hours: cert.hours,
        salary: cert.salary,
        demand: cert.demand,
      })),
      lessonsByLevel: {
        intro: LESSONS.filter((l) => l.level === "intro").length,
        basic: LESSONS.filter((l) => l.level === "basic").length,
        applied: LESSONS.filter((l) => l.level === "applied").length,
        exam: LESSONS.filter((l) => l.level === "exam").length,
      },
      topics: [...new Set(LESSONS.map((l) => l.topic))],
    },

    // Business info
    business: {
      plans: [
        { name: "スターター", price: 0, maxUsers: 5 },
        { name: "プロ", price: 29800, maxUsers: 50 },
        { name: "エンタープライズ", price: null, maxUsers: null },
      ],
      operator: "Canal AI",
      contact: "takuma.sato@canal-ai.com",
    },

    // Milestone tracking (to be updated as real data comes in)
    milestones: {
      phase: "Phase 1 - MVP → PMF",
      launchDate: "2026-06-01",
      exitCriteria: "登録ユーザー100名（2026年12月末）",
      targets: {
        registeredUsers: { target: 3000, current: 0 },
        mau: { target: 800, current: 0 },
        certPassed: { target: 100, current: 0 },
        b2bClients: { target: 10, current: 0 },
        mrr: { target: 300000, current: 0 },
      },
    },

    // Health check
    health: {
      status: "ok",
      version: "0.1.0",
      uptime: process.uptime(),
    },
  };

  return NextResponse.json(stats);
}
