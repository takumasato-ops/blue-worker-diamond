// localStorage-based state management for prototype
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
  { name: "第二種電気工事士", salary: 35, hours: 80, demand: "極めて高い" },
  { name: "第一種電気工事士", salary: 45, hours: 150, demand: "極めて高い" },
  { name: "2級施工管理技士", salary: 42, hours: 120, demand: "高い" },
  { name: "1級施工管理技士", salary: 55, hours: 200, demand: "高い" },
  { name: "フォークリフト運転技能", salary: 30, hours: 40, demand: "高い" },
  { name: "大型特殊自動車免許", salary: 38, hours: 60, demand: "高い" },
  { name: "危険物取扱者乙種4類", salary: 32, hours: 50, demand: "中〜高" },
  { name: "ボイラー技士2級", salary: 35, hours: 70, demand: "中〜高" },
];

// Mock admin data
export const MOCK_USERS = [
  { id: 1, name: "田中太郎", cert: "第二種電気工事士", progress: 72, quizRate: 85, value: 31, status: "学習中" },
  { id: 2, name: "鈴木花子", cert: "2級施工管理技士", progress: 45, quizRate: 78, value: 28, status: "学習中" },
  { id: 3, name: "佐藤健一", cert: "フォークリフト運転技能", progress: 95, quizRate: 92, value: 29, status: "紹介可能" },
  { id: 4, name: "山田美咲", cert: "危険物取扱者乙種4類", progress: 33, quizRate: 65, value: 25, status: "学習中" },
  { id: 5, name: "中村翔太", cert: "第一種電気工事士", progress: 88, quizRate: 90, value: 42, status: "紹介可能" },
];
