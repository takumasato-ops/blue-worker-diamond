// localStorage-based state management for prototype
export interface TopicScore {
  topic: string;
  correct: number;
  total: number;
  lastAttempt: string; // ISO date
}

export interface LessonResult {
  lessonId: number;
  correct: boolean;
  attempts: number;
  lastAttempt: string;
}

export interface UserProfile {
  name: string;
  age: number;
  currentJob: string;
  skills: string[];
  desiredSalary: number;
  targetCert: string;
  roadmap: RoadmapStep[];
  goalDate: string; // YYYY-MM-DD
  marketValue: number;
  studyHours: number;
  totalHours: number;
  quizCorrect: number;
  quizTotal: number;
  completedLessons: number[];
  tutorPlans: TutorPlan[];
  topicScores: TopicScore[];
  lessonResults: LessonResult[];
}

export interface RoadmapStep {
  id: number;
  title: string;
  hours: number;
  completed: boolean;
}

export interface TutorPlan {
  id: string;
  cert: string;
  goalDate: string;
  createdAt: string;
  weeks: TutorWeek[];
  examApplied: boolean;
  examResult: "pending" | "passed" | "failed" | null;
}

export interface TutorWeek {
  week: number;
  deadline: string;
  task: string;
  hours: number;
  done: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  age: 0,
  currentJob: "",
  skills: [],
  desiredSalary: 0,
  targetCert: "",
  roadmap: [],
  goalDate: "",
  marketValue: 22,
  studyHours: 0,
  totalHours: 100,
  quizCorrect: 0,
  quizTotal: 0,
  completedLessons: [],
  tutorPlans: [],
  topicScores: [],
  lessonResults: [],
};

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const data = localStorage.getItem("bwd_profile");
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
}

export function saveProfile(profile: Partial<UserProfile>) {
  const current = getProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem("bwd_profile", JSON.stringify(updated));
  return updated;
}

export const CERTIFICATIONS = [
  { name: "第二種電気工事士", salary: 35, hours: 80, demand: "極めて高い", future: "住宅・ビルの電気工事ができるようになり、年収420万円〜。独立すれば年収800万円超も現実的。再エネ・EV需要で引く手あまた。", examUrl: "https://www.shiken.or.jp/examination/e-construction02.html" },
  { name: "第一種電気工事士", salary: 45, hours: 150, demand: "極めて高い", future: "高圧工事も対応可能に。年収550万円〜。大規模施設やプラントの仕事に携われ、責任者ポジションを任される人材へ。", examUrl: "https://www.shiken.or.jp/examination/e-construction01.html" },
  { name: "2級施工管理技士", salary: 42, hours: 120, demand: "高い", future: "主任技術者として現場を統括。年収480万円〜。デスクワークと現場のバランスが取れ、営業経験も活かせるキャリア。", examUrl: "https://www.fcip-shiken.jp/" },
  { name: "1級施工管理技士", salary: 55, hours: 200, demand: "高い", future: "監理技術者として大型プロジェクトを指揮。年収700万円〜。ゼネコンや大手建設会社で幹部候補に。", examUrl: "https://www.fcip-shiken.jp/" },
  { name: "フォークリフト運転技能", salary: 30, hours: 40, demand: "高い", future: "物流・製造業で即戦力に。年収350万円〜。最短4日で取得でき、すぐに働き始められる。夜勤で年収UP可能。", examUrl: "https://www.komatsu-kyoshujo.co.jp/" },
  { name: "大型特殊自動車免許", salary: 38, hours: 60, demand: "高い", future: "重機オペレーターへの第一歩。年収420万円〜。建設・土木・農業と活躍の場が広い。複数資格で市場価値倍増。", examUrl: "https://www.npa.go.jp/policies/application/license_renewal/" },
  { name: "危険物取扱者乙種4類", salary: 32, hours: 50, demand: "中〜高", future: "ガソリンスタンド・化学工場で活躍。年収380万円〜。他資格との組み合わせでビルメン業界でも重宝される万能資格。", examUrl: "https://www.shoubo-shiken.or.jp/" },
  { name: "ボイラー技士2級", salary: 35, hours: 70, demand: "中〜高", future: "ビルメンテナンス業界への入口。年収380万円〜。残業少なめで家族との時間を大切にしながら安定収入を実現。", examUrl: "https://www.exam.or.jp/exmn/H_nittei.htm" },
];

// Topic score tracking
export function recordTopicResult(topic: string, correct: boolean) {
  const profile = getProfile();
  const scores = [...(profile.topicScores || [])];
  const existing = scores.find((s) => s.topic === topic);
  if (existing) {
    existing.correct += correct ? 1 : 0;
    existing.total += 1;
    existing.lastAttempt = new Date().toISOString();
  } else {
    scores.push({ topic, correct: correct ? 1 : 0, total: 1, lastAttempt: new Date().toISOString() });
  }
  saveProfile({ topicScores: scores });
}

export function recordLessonResult(lessonId: number, correct: boolean) {
  const profile = getProfile();
  const results = [...(profile.lessonResults || [])];
  const existing = results.find((r) => r.lessonId === lessonId);
  if (existing) {
    existing.correct = correct;
    existing.attempts += 1;
    existing.lastAttempt = new Date().toISOString();
  } else {
    results.push({ lessonId, correct, attempts: 1, lastAttempt: new Date().toISOString() });
  }
  saveProfile({ lessonResults: results });
}

// Get weak topics (accuracy < 60% with at least 1 attempt)
// Pass certTopics from the calling code to avoid circular imports
export function getWeakTopics(cert?: string, certTopicNames?: string[]): TopicScore[] {
  const profile = getProfile();
  const scores = profile.topicScores || [];
  if (cert && certTopicNames) {
    const topicSet = new Set(certTopicNames);
    return scores
      .filter((s) => topicSet.has(s.topic) && s.total > 0 && (s.correct / s.total) < 0.6)
      .sort((a, b) => (a.correct / a.total) - (b.correct / b.total));
  }
  return scores
    .filter((s) => s.total > 0 && (s.correct / s.total) < 0.6)
    .sort((a, b) => (a.correct / a.total) - (b.correct / b.total));
}

// Mock admin data
export const MOCK_USERS = [
  { id: 1, name: "田中太郎", cert: "第二種電気工事士", progress: 72, quizRate: 85, value: 31, status: "学習中" },
  { id: 2, name: "鈴木花子", cert: "2級施工管理技士", progress: 45, quizRate: 78, value: 28, status: "学習中" },
  { id: 3, name: "佐藤健一", cert: "フォークリフト運転技能", progress: 95, quizRate: 92, value: 29, status: "紹介可能" },
  { id: 4, name: "山田美咲", cert: "危険物取扱者乙種4類", progress: 33, quizRate: 65, value: 25, status: "学習中" },
  { id: 5, name: "中村翔太", cert: "第一種電気工事士", progress: 88, quizRate: 90, value: 42, status: "紹介可能" },
];
