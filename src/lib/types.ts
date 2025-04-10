
export type Role = "SDE" | "Product Manager" | "ML Engineer";

export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

export interface Employee {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
  department: string;
  manager: string;
  joinDate: string;
}

export interface PerformanceData {
  id: string;
  employeeId: string;
  month: string; // Format: YYYY-MM
  rating: PerformanceRating;
  metrics: RoleMetrics;
  feedback: Feedback[];
}

export interface RoleMetrics {
  codeQuality?: number; // 1-100 - SDE
  velocity?: number; // Story points - SDE
  commitFrequency?: number; // Commits per week - SDE
  pullRequestsReviewed?: number; // PRs reviewed - SDE
  bugsIntroduced?: number; // Number of bugs - SDE
  onTimeDelivery?: number; // Percentage - SDE, PM
  
  productImpact?: number; // 1-100 - PM
  stakeholderSatisfaction?: number; // 1-100 - PM
  requirementQuality?: number; // 1-100 - PM
  decisionsTimeliness?: number; // 1-100 - PM
  
  modelAccuracy?: number; // Percentage - ML
  experimentVelocity?: number; // Number of experiments - ML
  paperContributions?: number; // Number of papers - ML
  dataQuality?: number; // 1-100 - ML
  modelDeployments?: number; // Number of deployments - ML
}

export interface Feedback {
  id: string;
  from: string;
  date: string;
  text: string;
  category: "peer" | "manager" | "self" | "system";
  sentiment: "positive" | "negative" | "neutral";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | "HR" | "Manager";
  avatar: string;
}

export interface AIInsight {
  id: string;
  employeeId: string;
  date: string;
  title: string;
  description: string;
  category: "strength" | "improvement" | "trend" | "recommendation";
  confidence: number; // 0-100
}

export interface DevelopmentPlan {
  id: string;
  employeeId: string;
  created: string;
  goals: DevelopmentGoal[];
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  description: string;
  category: "technical" | "soft" | "leadership" | "domain";
  status: "not-started" | "in-progress" | "completed";
  dueDate: string;
}
