"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { JOB_CATEGORIES, JobCategory, Job } from "@/lib/jobs";
import { getProfile, saveProfile, CERTIFICATIONS } from "@/lib/store";

export default function JobsPage() {
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const router = useRouter();

  const startLearning = (job: Job) => {
    const cert = job.certs[0];
    const certInfo = CERTIFICATIONS.find((c) => c.name === cert.name);
    const profile = getProfile();
    saveProfile({
      targetCert: profile.targetCert || cert.name,
      totalHours: certInfo?.hours || cert.hours,
      marketValue: profile.marketValue || 22,
    });
    router.push(`/learn?cert=${encodeURIComponent(cert.name)}&newplan=1`);
  };

  const allJobs = JOB_CATEGORIES.flatMap((c) => c.jobs);
  const displayJobs = activeCategory === "all" ? allJobs : (JOB_CATEGORIES.find((c) => c.id === activeCategory)?.jobs || []);
  const currentCatDesc = activeCategory === "all" ? "すべての職種を一覧で表示しています" : JOB_CATEGORIES.find((c) => c.id === activeCategory)?.description || "";

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-lg">学科一覧</h1>
          <p className="text-sub text-sm mt-1">気になる学科をクリックして詳細を確認。すべて無料で受講できます。</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
          <button
            onClick={() => { setActiveCategory("all"); setOpenJob(null); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === "all" ? "bg-accent text-white" : "bg-bg2 text-sub hover:text-text border border-border"}`}
          >
            すべて
          </button>
          {JOB_CATEGORIES.map((cat: JobCategory) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenJob(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat.id
                  ? "bg-accent text-white"
                  : "bg-bg2 text-sub hover:text-text border border-border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p className="text-sm text-sub mb-6">{currentCatDesc}</p>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {displayJobs.map((job: Job) => (
            <div
              key={job.id}
              className={`card overflow-hidden cursor-pointer transition hover:shadow-md ${openJob === job.id ? "ring-2 ring-accent" : ""}`}
              onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={job.image}
                  alt={job.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[15px] mb-2">{job.title}</h3>
                <div className="text-xs mb-2.5">
                  <span className="text-accent font-bold">{job.salaryRange.min}万円</span>
                  <span className="text-sub mx-1">〜</span>
                  <span className="text-accent font-bold">{job.salaryRange.max}万円</span>
                </div>
                <div className="text-xs text-light mb-2.5">
                  学習目安: 約{job.certs.length === 1 ? `${job.certs[0].hours}` : `${Math.min(...job.certs.map(c => c.hours))}〜${Math.max(...job.certs.map(c => c.hours))}`}時間
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-bg2 text-sub border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal popup */}
        {openJob && (() => {
          const job = allJobs.find((j) => j.id === openJob);
          if (!job) return null;
          return (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-10 pb-10 px-4 bg-black/50" onClick={() => setOpenJob(null)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between sticky top-0 bg-white pb-3 border-b border-border -mx-6 px-6 -mt-6 pt-6">
                <h2 className="font-bold text-lg">{job.title}</h2>
                <button onClick={() => setOpenJob(null)} className="text-sub hover:text-text text-sm">&#10005;</button>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-sub uppercase tracking-wider mb-3">取得できる資格と市場価値</h3>
                <div className="space-y-2">
                  {job.certs.map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-4 bg-bg2 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-sub mt-0.5">学習時間: 約{c.hours}時間</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-accent">{c.salary}</div>
                        <div className="text-xs text-sub mt-0.5">需要: {c.demand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-sub uppercase tracking-wider mb-3">年収</h3>
                <div className="flex items-center gap-3 bg-bg2 rounded-lg p-4 mb-3">
                  <div className="text-center flex-1">
                    <div className="text-[10px] text-sub mb-1">最低年収</div>
                    <div className="text-xl font-black text-text">{job.salaryRange.min}<span className="text-xs text-sub font-normal">万円</span></div>
                  </div>
                  <div className="text-sub text-lg">→</div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] text-sub mb-1">最高年収</div>
                    <div className="text-xl font-black text-accent">{job.salaryRange.max}<span className="text-xs text-sub font-normal">万円</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "未経験", value: job.salary.entry, color: "border-l-sub" },
                    { label: "中堅", value: job.salary.mid, color: "border-l-accent" },
                    { label: "ベテラン", value: job.salary.senior, color: "border-l-green" },
                  ].map((s) => (
                    <div key={s.label} className={`bg-bg2 rounded-lg p-4 border-l-[3px] ${s.color}`}>
                      <div className="text-xs text-sub mb-1">{s.label}</div>
                      <div className="text-sm font-bold">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-sub uppercase tracking-wider mb-3">キャリアパス</h3>
                <p className="text-sm text-sub leading-relaxed bg-bg2 rounded-lg p-4">{job.career}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-sub uppercase tracking-wider mb-3">この職種のポイント</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {job.appeal.map((a, i) => (
                    <div key={i} className="flex gap-2.5 p-3 bg-bg2 rounded-lg">
                      <span className="text-green mt-0.5 flex-shrink-0">&#10003;</span>
                      <span className="text-sm text-sub">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2 flex-wrap">
                <button onClick={() => { startLearning(job); }} className="btn-primary px-5 py-2.5 text-sm">この学科に入学する</button>
                <a href="/onboarding" className="btn-secondary px-5 py-2.5 text-sm">AIで診断する</a>
                <a href="/advisor" className="btn-secondary px-5 py-2.5 text-sm">入学相談</a>
              </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
