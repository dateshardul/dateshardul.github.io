
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
  experienceYears: number;
  skills: string[];
  previousCompany?: string;
  education?: string;
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
  // SDE Metrics
  codeQuality?: number; // 1-100
  velocity?: number; // Story points
  commitFrequency?: number; // Commits per week
  pullRequestsReviewed?: number; // PRs reviewed
  bugsIntroduced?: number; // Number of bugs
  onTimeDelivery?: number; // Percentage
  complexityScore?: number; // 1-100
  testCoverage?: number; // Percentage
  
  // PM Metrics
  productImpact?: number; // 1-100
  stakeholderSatisfaction?: number; // 1-100
  requirementQuality?: number; // 1-100
  decisionsTimeliness?: number; // 1-100
  featureDeliveryRate?: number; // Percentage
  roadmapAdherence?: number; // Percentage
  marketAnalysisScore?: number; // 1-100
  
  // ML Engineer Metrics
  modelAccuracy?: number; // Percentage
  experimentVelocity?: number; // Number of experiments
  paperContributions?: number; // Number of papers
  dataQuality?: number; // 1-100
  modelDeployments?: number; // Number of deployments
  pipelineUptime?: number; // Percentage
  algorithmComplexity?: number; // 1-100
}

export interface Feedback {
  id: string;
  from: string;
  date: string;
  text: string;
  category: "peer" | "manager" | "self" | "system";
  sentiment: "positive" | "negative" | "neutral";
  topics?: string[]; // New: topics identified in the feedback
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | "HR" | "Manager";
  avatar: string;
  permissions?: string[]; // Added permissions for admin features
}

export interface AIInsight {
  id: string;
  employeeId: string;
  date: string;
  title: string;
  description: string;
  category: "strength" | "improvement" | "trend" | "recommendation";
  confidence: number; // 0-100
  relatedMetrics?: string[]; // New: related metrics for this insight
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
  completionPercentage?: number; // New: percentage of completion
  relatedSkills?: string[]; // New: skills related to this goal
}

// New interfaces for compensation data
export interface CompensationData {
  id: string;
  employeeId: string;
  year: number;
  baseSalary: number;
  bonus?: number;
  stockOptions?: number;
  totalCompensation: number;
  performanceRating: PerformanceRating;
  notes?: string;
}

// New interface for admin configuration
export interface AdminConfig {
  dataGenerationParameters: {
    performanceDistribution: string; // 'normal', 'skewed-high', 'skewed-low'
    feedbackVolume: number; // 1-10 scale
    trendStrength: number; // 1-10 scale for how strong trends should be
  };
  simulationScenarios: SimulationScenario[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  affectedEmployees: string[];
  performanceShift: number; // -100 to 100 percentage
  duration: number; // months
  active: boolean;
}
