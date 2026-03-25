"use client";
import { useState } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import { JOB_CATEGORIES, JobCategory, Job } from "@/lib/jobs";

export default function JobsPage() {
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(JOB_CATEGORIES[0].id);

  const currentCat = JOB_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-lg">業種一覧</h1>
          <p className="text-sub text-sm mt-1">気になる職種をクリックして詳細を確認</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
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

        <p className="text-sm text-sub mb-6">{currentCat.description}</p>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {currentCat.jobs.map((job: Job) => (
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
                <div className="flex gap-3 text-xs text-sub mb-2.5">
                  <span>{job.salary.entry} 〜 {job.salary.senior}</span>
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

        {/* Selected job detail */}
        {openJob && (() => {
          const job = currentCat.jobs.find((j) => j.id === openJob);
          if (!job) return null;
          return (
            <div className="card p-6 mb-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">{job.title}</h2>
                <button onClick={() => setOpenJob(null)} className="text-sub hover:text-text text-sm">閉じる</button>
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
                <h3 className="text-xs font-semibold text-sub uppercase tracking-wider mb-3">給与レンジ</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "未経験", value: job.salary.entry, color: "border-l-sub" },
                    { label: "中堅（3〜5年）", value: job.salary.mid, color: "border-l-accent" },
                    { label: "ベテラン・管理職", value: job.salary.senior, color: "border-l-green" },
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

              <div className="flex gap-3 pt-2">
                <a href="/onboarding" className="btn-primary px-5 py-2.5 text-sm">この職種で診断を始める</a>
                <a href="/advisor" className="btn-secondary px-5 py-2.5 text-sm">アドバイザーに相談</a>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
