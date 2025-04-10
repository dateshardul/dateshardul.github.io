import { faker } from "@faker-js/faker";
import {
  Employee,
  PerformanceData,
  Role,
  Feedback,
  AIInsight,
  DevelopmentPlan,
  DevelopmentGoal,
  User
} from "./types";

// Seed the random number generator for consistent results
faker.seed(123);

// Generate employees
export const generateEmployees = (count: number = 20): Employee[] => {
  const roles: Role[] = ["SDE", "Product Manager", "ML Engineer"];
  const departments = ["Engineering", "Product", "Data Science", "Platform", "Mobile"];
  const managers = [
    "Sarah Johnson",
    "Michael Chen",
    "Priya Patel",
    "David Rodriguez",
    "Emma Wilson"
  ];

  return Array.from({ length: count }).map((_, index) => {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const manager = managers[Math.floor(Math.random() * managers.length)];
    
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      role,
      email: faker.internet.email(),
      avatar: faker.image.avatarGitHub(),
      department,
      manager,
      joinDate: faker.date.past({ years: 5 }).toISOString().split("T")[0]
    };
  });
};

// Generate performance data for all employees over 6 months
export const generatePerformanceData = (employees: Employee[]): PerformanceData[] => {
  const performanceData: PerformanceData[] = [];
  const currentDate = new Date();
  
  // Generate data for the last 6 months
  for (let i = 0; i < 6; i++) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    const monthString = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    
    for (const employee of employees) {
      // Create performance pattern - some employees improve, some decline, some stay consistent
      let baseRating;
      const employeePattern = faker.number.int({ min: 1, max: 3 });
      
      if (employeePattern === 1) {
        // Improving pattern
        baseRating = 3 + (i * 0.4); // Rating improves as we get closer to current month
      } else if (employeePattern === 2) {
        // Declining pattern
        baseRating = 5 - (i * 0.3); // Rating declines as we get closer to current month
      } else {
        // Consistent pattern with slight variations
        baseRating = 3.5 + faker.number.float({ min: -0.5, max: 0.5 });
      }
      
      // Add some randomness but keep within 1-5 range
      let rating = Math.round(baseRating + faker.number.float({ min: -0.5, max: 0.5 }));
      rating = Math.max(1, Math.min(5, rating)) as 1 | 2 | 3 | 4 | 5;
      
      // Generate role-specific metrics
      const metrics = generateMetricsForRole(employee.role, rating);
      
      // Generate feedback
      const feedback = generateFeedbackForEmployee(employee, 3, monthString, rating);
      
      performanceData.push({
        id: faker.string.uuid(),
        employeeId: employee.id,
        month: monthString,
        rating,
        metrics,
        feedback
      });
    }
  }
  
  return performanceData;
};

// Generate metrics based on role and performance rating
const generateMetricsForRole = (role: Role, rating: number) => {
  // Base metrics influenced by rating (1-5 scale)
  const performanceFactor = rating / 5; // 0.2 to 1.0
  
  // Add some randomness to metrics
  const randomFactor = () => faker.number.float({ min: 0.8, max: 1.2 });
  
  switch (role) {
    case "SDE":
      return {
        codeQuality: Math.round(60 + (performanceFactor * 40) * randomFactor()),
        velocity: Math.round(5 + (performanceFactor * 15) * randomFactor()),
        commitFrequency: Math.round(3 + (performanceFactor * 17) * randomFactor()),
        pullRequestsReviewed: Math.round(2 + (performanceFactor * 8) * randomFactor()),
        bugsIntroduced: Math.round(10 - (performanceFactor * 8) * randomFactor()),
        onTimeDelivery: Math.round(70 + (performanceFactor * 30) * randomFactor())
      };
    
    case "Product Manager":
      return {
        productImpact: Math.round(60 + (performanceFactor * 40) * randomFactor()),
        stakeholderSatisfaction: Math.round(70 + (performanceFactor * 30) * randomFactor()),
        requirementQuality: Math.round(65 + (performanceFactor * 35) * randomFactor()),
        decisionsTimeliness: Math.round(60 + (performanceFactor * 40) * randomFactor()),
        onTimeDelivery: Math.round(70 + (performanceFactor * 30) * randomFactor())
      };
    
    case "ML Engineer":
      return {
        modelAccuracy: Math.round(70 + (performanceFactor * 30) * randomFactor()),
        experimentVelocity: Math.round(3 + (performanceFactor * 7) * randomFactor()),
        paperContributions: Math.round(performanceFactor * 3 * randomFactor()),
        dataQuality: Math.round(65 + (performanceFactor * 35) * randomFactor()),
        modelDeployments: Math.round(1 + (performanceFactor * 4) * randomFactor())
      };
    
    default:
      return {};
  }
};

// Generate feedback for an employee
const generateFeedbackForEmployee = (
  employee: Employee, 
  count: number, 
  month: string, 
  rating: number
): Feedback[] => {
  const feedbackTemplates = {
    SDE: {
      positive: [
        "Consistently delivers high-quality code with excellent test coverage.",
        "Great at breaking down complex technical problems into manageable tasks.",
        "Takes ownership of issues and works diligently to resolve them.",
        "Proactively identifies and addresses technical debt.",
        "Excellent code reviewer who provides thorough and constructive feedback."
      ],
      negative: [
        "Need to improve code documentation for better maintainability.",
        "Should focus on writing more unit tests to prevent regressions.",
        "Sometimes takes too long to complete tasks due to overengineering.",
        "Could improve communication around technical roadblocks.",
        "Should be more open to alternative technical approaches."
      ],
      neutral: [
        "Continues to develop technical skills at an expected pace.",
        "Maintains consistent performance in coding tasks.",
        "Works well within established patterns and practices.",
        "Follows team processes adequately.",
        "Communicates technical concepts effectively to the team."
      ]
    },
    "Product Manager": {
      positive: [
        "Excellent at gathering and synthesizing stakeholder requirements.",
        "Maintains a clear product vision and effectively communicates it.",
        "Makes data-driven decisions that positively impact product metrics.",
        "Great at prioritizing features based on business impact and technical constraints.",
        "Builds strong relationships with cross-functional teams."
      ],
      negative: [
        "Product requirements often lack necessary details for implementation.",
        "Needs to improve on setting realistic deadlines for features.",
        "Should gather more user feedback before finalizing product decisions.",
        "Could improve on technical understanding to better collaborate with engineering.",
        "Tends to change requirements too frequently during development."
      ],
      neutral: [
        "Maintains a balanced approach to feature prioritization.",
        "Documents requirements with adequate detail for implementation.",
        "Collaborates effectively with most stakeholders.",
        "Demonstrates understanding of product metrics and their impact.",
        "Responds appropriately to changing market conditions."
      ]
    },
    "ML Engineer": {
      positive: [
        "Excellent at selecting appropriate models for specific business problems.",
        "Creates robust data pipelines that handle edge cases well.",
        "Effectively balances model accuracy with computational efficiency.",
        "Exceptional at explaining complex ML concepts to non-technical stakeholders.",
        "Consistently improves model performance through thoughtful experimentation."
      ],
      negative: [
        "Should improve monitoring of models in production for performance degradation.",
        "Needs to document experimental results more thoroughly.",
        "Could improve on validating data quality before model training.",
        "Should consider implementation complexity when selecting modeling approaches.",
        "Model evaluation metrics don't always align with business objectives."
      ],
      neutral: [
        "Follows established best practices for model development.",
        "Documents experiments with sufficient detail for reproducibility.",
        "Adequately validates models before deployment.",
        "Maintains awareness of current research relevant to our problems.",
        "Balances innovation with practical business constraints."
      ]
    }
  };

  // Select feedback category based on rating
  const determineSentiment = (rating: number): "positive" | "negative" | "neutral" => {
    if (rating >= 4) return "positive";
    if (rating <= 2) return "negative";
    return "neutral";
  };

  // Generate feedback from different sources
  return Array.from({ length: count }).map(() => {
    // Mix of sentiments, weighted by overall rating
    let sentiment: "positive" | "negative" | "neutral";
    const rand = Math.random();
    
    if (rating >= 4) {
      sentiment = rand < 0.7 ? "positive" : rand < 0.9 ? "neutral" : "negative";
    } else if (rating <= 2) {
      sentiment = rand < 0.7 ? "negative" : rand < 0.9 ? "neutral" : "positive";
    } else {
      sentiment = rand < 0.5 ? "neutral" : rand < 0.75 ? "positive" : "negative";
    }
    
    const category = rand < 0.4 ? "peer" : rand < 0.7 ? "manager" : rand < 0.9 ? "self" : "system";
    
    // Get templates for the employee's role
    const roleTemplates = feedbackTemplates[employee.role as keyof typeof feedbackTemplates];
    const sentimentTemplates = roleTemplates[sentiment as keyof typeof roleTemplates];
    
    // Select a random template and customize it slightly
    let feedbackText = sentimentTemplates[Math.floor(Math.random() * sentimentTemplates.length)];
    
    // Customize with some specific details
    if (employee.role === "SDE") {
      feedbackText = feedbackText.replace("technical problems", `issues in the ${faker.helpers.arrayElement(["authentication", "payment", "notification", "dashboard"])} system`);
    } else if (employee.role === "Product Manager") {
      feedbackText = feedbackText.replace("stakeholders", faker.helpers.arrayElement(["marketing team", "sales team", "engineering team", "executives"]));
    } else if (employee.role === "ML Engineer") {
      feedbackText = feedbackText.replace("models", faker.helpers.arrayElement(["recommendation models", "forecasting models", "classification models", "clustering algorithms"]));
    }
    
    return {
      id: faker.string.uuid(),
      from: category === "self" ? employee.name : faker.person.fullName(),
      date: `${month}-${faker.number.int({ min: 1, max: 28 })}`,
      text: feedbackText,
      category,
      sentiment
    };
  });
};

// Generate AI insights based on performance data
export const generateAIInsights = (
  employees: Employee[],
  performanceData: PerformanceData[]
): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Group performance data by employee
  const employeePerformance = new Map<string, PerformanceData[]>();
  performanceData.forEach(perf => {
    if (!employeePerformance.has(perf.employeeId)) {
      employeePerformance.set(perf.employeeId, []);
    }
    employeePerformance.get(perf.employeeId)?.push(perf);
  });
  
  // Generate insights for each employee
  employees.forEach(employee => {
    const employeeData = employeePerformance.get(employee.id) || [];
    
    // Sort by month
    employeeData.sort((a, b) => a.month.localeCompare(b.month));
    
    if (employeeData.length < 2) return; // Need at least 2 months of data
    
    // Calculate trends
    const ratings = employeeData.map(data => data.rating);
    const isImproving = ratings[ratings.length - 1] > ratings[0];
    const isDecreasing = ratings[ratings.length - 1] < ratings[0];
    
    // Generate trend insight
    if (isImproving || isDecreasing) {
      insights.push({
        id: faker.string.uuid(),
        employeeId: employee.id,
        date: new Date().toISOString(),
        title: isImproving ? "Consistent Performance Improvement" : "Performance Needs Attention",
        description: isImproving 
          ? `${employee.name} has shown steady improvement over the last ${employeeData.length} months, with ratings increasing from ${ratings[0]} to ${ratings[ratings.length - 1]}.`
          : `${employee.name}'s performance has been declining over the last ${employeeData.length} months, with ratings decreasing from ${ratings[0]} to ${ratings[ratings.length - 1]}.`,
        category: "trend",
        confidence: faker.number.int({ min: 80, max: 95 })
      });
    }
    
    // Generate role-specific insights
    const latestData = employeeData[employeeData.length - 1];
    
    if (employee.role === "SDE") {
      const metrics = latestData.metrics;
      
      if (metrics.codeQuality && metrics.codeQuality > 85) {
        insights.push({
          id: faker.string.uuid(),
          employeeId: employee.id,
          date: new Date().toISOString(),
          title: "Exceptional Code Quality",
          description: `${employee.name} consistently produces high-quality code with a quality score of ${metrics.codeQuality}/100, significantly above team average.`,
          category: "strength",
          confidence: faker.number.int({ min: 85, max: 98 })
        });
      }
      
      if (metrics.bugsIntroduced && metrics.bugsIntroduced > 7) {
        insights.push({
          id: faker.string.uuid(),
          employeeId: employee.id,
          date: new Date().toISOString(),
          title: "Code Quality Improvement Opportunity",
          description: `${employee.name} has introduced ${metrics.bugsIntroduced} bugs in the last month, which is above team average. Consider additional code reviews or pairing sessions.`,
          category: "improvement",
          confidence: faker.number.int({ min: 75, max: 90 })
        });
      }
    }
    
    if (employee.role === "Product Manager") {
      const metrics = latestData.metrics;
      
      if (metrics.stakeholderSatisfaction && metrics.stakeholderSatisfaction > 90) {
        insights.push({
          id: faker.string.uuid(),
          employeeId: employee.id,
          date: new Date().toISOString(),
          title: "Outstanding Stakeholder Management",
          description: `${employee.name} has achieved exceptional stakeholder satisfaction scores of ${metrics.stakeholderSatisfaction}/100, demonstrating excellent communication and expectation setting.`,
          category: "strength",
          confidence: faker.number.int({ min: 85, max: 95 })
        });
      }
      
      if (metrics.requirementQuality && metrics.requirementQuality < 70) {
        insights.push({
          id: faker.string.uuid(),
          employeeId: employee.id,
          date: new Date().toISOString(),
          title: "Requirements Definition Opportunity",
          description: `${employee.name}'s requirement quality score is ${metrics.requirementQuality}/100. Recommend providing additional detail and acceptance criteria in user stories.`,
          category: "improvement",
          confidence: faker.number.int({ min: 75, max: 90 })
        });
      }
    }
    
    if (employee.role === "ML Engineer") {
      const metrics = latestData.metrics;
      
      if (metrics.modelAccuracy && metrics.modelAccuracy > 85) {
        insights.push({
          id: faker.string.uuid(),
          employeeId: employee.id,
          date: new Date().toISOString(),
          title: "Exceptional Model Performance",
          description: `${employee.name} has achieved ${metrics.modelAccuracy}% model accuracy, significantly improving prediction quality for business outcomes.`,
          category: "strength",
          confidence: faker.number.int({ min: 85, max: 98 })
        });
      }
      
      if (metrics.experimentVelocity && metrics.experimentVelocity < 3) {
        insights.push({
          id: faker.string.uuid(),
          employeeId: employee.id,
          date: new Date().toISOString(),
          title: "Experimentation Opportunity",
          description: `${employee.name} conducted ${metrics.experimentVelocity} experiments last month, below team average. Consider allocating more time for hypothesis testing and exploration.`,
          category: "improvement",
          confidence: faker.number.int({ min: 75, max: 90 })
        });
      }
    }
    
    // Generate a recommendation for everyone
    insights.push({
      id: faker.string.uuid(),
      employeeId: employee.id,
      date: new Date().toISOString(),
      title: generateRecommendationTitle(employee.role),
      description: generateRecommendationDescription(employee),
      category: "recommendation",
      confidence: faker.number.int({ min: 70, max: 90 })
    });
  });
  
  return insights;
};

const generateRecommendationTitle = (role: Role): string => {
  const roleTitles = {
    "SDE": [
      "Technical Skill Development Pathway",
      "Code Quality Enhancement Plan",
      "Architecture Knowledge Expansion"
    ],
    "Product Manager": [
      "Strategic Product Thinking Enhancement",
      "User Research Skill Development",
      "Cross-functional Leadership Growth"
    ],
    "ML Engineer": [
      "Advanced Modeling Techniques Pathway",
      "Model Deployment Skill Enhancement",
      "Data Pipeline Optimization Learning"
    ]
  };
  
  const options = roleTitles[role];
  return options[Math.floor(Math.random() * options.length)];
};

const generateRecommendationDescription = (employee: Employee): string => {
  const roleRecommendations = {
    "SDE": [
      `Based on ${employee.name}'s performance, we recommend focusing on advanced system design principles through our internal tech talks and external courses.`,
      `${employee.name} would benefit from our advanced testing workshop series to further enhance code quality and reliability.`,
      `We recommend ${employee.name} participate in the upcoming microservices architecture workshop to expand technical breadth.`
    ],
    "Product Manager": [
      `${employee.name} should consider enrollment in our advanced user research workshop to strengthen customer insights generation.`,
      `Based on performance data, we recommend ${employee.name} focus on our data-driven decision making course to enhance product strategy.`,
      `${employee.name} would benefit from our cross-functional leadership program to further develop stakeholder management skills.`
    ],
    "ML Engineer": [
      `We recommend ${employee.name} participate in our advanced model optimization workshop to enhance model performance skills.`,
      `${employee.name} should consider our MLOps certification program to strengthen the deployment and monitoring of models.`,
      `Based on current skills, ${employee.name} would benefit from our distributed computing for ML workshop to handle larger datasets.`
    ]
  };
  
  const options = roleRecommendations[employee.role];
  return options[Math.floor(Math.random() * options.length)];
};

// Generate development plans
export const generateDevelopmentPlans = (
  employees: Employee[],
  insights: AIInsight[]
): DevelopmentPlan[] => {
  return employees.map(employee => {
    // Filter insights for this employee
    const employeeInsights = insights.filter(insight => insight.employeeId === employee.id);
    
    // Generate 3-5 development goals
    const goalCount = faker.number.int({ min: 3, max: 5 });
    const goals: DevelopmentGoal[] = [];
    
    // Use insights to inform goals where possible
    for (let i = 0; i < goalCount; i++) {
      // Create goal categories based on role
      let categories: ("technical" | "soft" | "leadership" | "domain")[];
      
      switch (employee.role) {
        case "SDE":
          categories = ["technical", "technical", "soft", "leadership"];
          break;
        case "Product Manager":
          categories = ["domain", "soft", "leadership", "technical"];
          break;
        case "ML Engineer":
          categories = ["technical", "domain", "technical", "soft"];
          break;
        default:
          categories = ["technical", "soft", "leadership", "domain"];
      }
      
      const category = categories[i % categories.length];
      
      // Generate goal details
      const goal: DevelopmentGoal = {
        id: faker.string.uuid(),
        title: generateGoalTitle(employee.role, category),
        description: generateGoalDescription(employee.role, category),
        category,
        status: faker.helpers.arrayElement(["not-started", "in-progress", "completed"]),
        dueDate: faker.date.future().toISOString().split("T")[0]
      };
      
      goals.push(goal);
    }
    
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      created: faker.date.recent().toISOString().split("T")[0],
      goals
    };
  });
};

const generateGoalTitle = (role: Role, category: string): string => {
  const titles = {
    SDE: {
      technical: [
        "Master Advanced System Design Patterns",
        "Implement Microservice Architecture",
        "Achieve AWS Solutions Architect Certification",
        "Develop Expertise in Kubernetes Orchestration"
      ],
      soft: [
        "Improve Technical Documentation Skills",
        "Enhance Code Review Communication",
        "Develop Mentoring Capabilities",
        "Strengthen Cross-functional Collaboration"
      ],
      leadership: [
        "Lead a Technical Initiative",
        "Mentor Junior Developers",
        "Drive Technical Decision Making",
        "Establish Technical Best Practices"
      ],
      domain: [
        "Deepen Financial Domain Knowledge",
        "Understand Healthcare Compliance Requirements",
        "Master E-commerce Business Logic",
        "Study Telecommunications Industry Standards"
      ]
    },
    "Product Manager": {
      technical: [
        "Develop Data Analysis Proficiency",
        "Learn Basic Frontend Development",
        "Master Product Analytics Tools",
        "Understand CI/CD Pipelines"
      ],
      soft: [
        "Enhance Stakeholder Communication",
        "Improve Presentation Skills",
        "Develop Negotiation Techniques",
        "Strengthen Team Collaboration"
      ],
      leadership: [
        "Lead Cross-functional Initiative",
        "Develop Strategic Product Vision",
        "Drive Product Organization",
        "Establish Product Development Process"
      ],
      domain: [
        "Deepen Market Analysis Skills",
        "Master Competitive Analysis",
        "Develop User Research Expertise",
        "Strengthen Business Case Development"
      ]
    },
    "ML Engineer": {
      technical: [
        "Master Advanced Deep Learning Techniques",
        "Implement MLOps Best Practices",
        "Develop Expertise in Distributed ML",
        "Learn Reinforcement Learning Applications"
      ],
      soft: [
        "Improve Technical Documentation",
        "Enhance Model Explanation Skills",
        "Develop Cross-functional Communication",
        "Strengthen Data Storytelling"
      ],
      leadership: [
        "Lead ML Model Development",
        "Mentor Junior ML Engineers",
        "Drive ML Strategy Definition",
        "Establish ML Best Practices"
      ],
      domain: [
        "Deepen NLP Domain Knowledge",
        "Master Computer Vision Applications",
        "Understand Time Series Analysis",
        "Study Recommendation Systems"
      ]
    }
  };
  
  const roleCategory = titles[role][category as keyof typeof titles[typeof role]];
  return roleCategory[Math.floor(Math.random() * roleCategory.length)];
};

const generateGoalDescription = (role: Role, category: string): string => {
  const descriptions = {
    SDE: {
      technical: [
        "Complete the advanced system design course and apply patterns to at least one production project.",
        "Refactor monolithic component into microservices architecture following best practices.",
        "Obtain AWS Solutions Architect certification through study and exam completion.",
        "Deploy and manage production workloads using Kubernetes with proper monitoring and scaling."
      ],
      soft: [
        "Improve documentation quality by creating comprehensive guides for at least 3 key systems.",
        "Provide constructive feedback in code reviews that elevates team standards without causing friction.",
        "Mentor 2 junior developers on specific technical areas through pair programming sessions.",
        "Successfully collaborate with product and design teams to deliver 3 major features on schedule."
      ],
      leadership: [
        "Lead the implementation of a significant technical initiative that impacts multiple teams.",
        "Establish a mentoring relationship with 2-3 junior developers and track their progress.",
        "Make key technical decisions for a project and document the decision-making process.",
        "Document and implement technical best practices that are adopted by the broader team."
      ],
      domain: [
        "Work with domain experts to understand financial regulations impacting our systems.",
        "Complete HIPAA compliance training and apply guidelines to healthcare-related features.",
        "Map the customer journey for key e-commerce flows and optimize the technical implementation.",
        "Research telecommunications standards and ensure our systems are compliant."
      ]
    },
    "Product Manager": {
      technical: [
        "Complete SQL training and independently analyze product metrics to drive decisions.",
        "Learn HTML/CSS/JavaScript fundamentals to better collaborate with frontend teams.",
        "Become proficient in Amplitude/Mixpanel to independently track product performance.",
        "Understand deployment processes to better coordinate releases and feature flags."
      ],
      soft: [
        "Develop structured communication frameworks for different stakeholder groups.",
        "Create and deliver compelling product presentations to executive leadership.",
        "Successfully negotiate feature priorities with multiple stakeholder groups.",
        "Facilitate productive cross-functional team meetings with clear outcomes."
      ],
      leadership: [
        "Lead initiative requiring coordination across engineering, design, and marketing teams.",
        "Develop and present a long-term product vision that gains executive support.",
        "Establish product team processes that improve delivery predictability by 20%.",
        "Create and implement a product development framework adopted by other PMs."
      ],
      domain: [
        "Conduct comprehensive market analysis identifying key opportunities for product growth.",
        "Create detailed competitive analysis framework tracking 5 key competitors quarterly.",
        "Conduct 20 user interviews and synthesize insights into actionable product improvements.",
        "Develop ROI model for major features that accurately predicts business impact."
      ]
    },
    "ML Engineer": {
      technical: [
        "Implement and evaluate three advanced deep learning architectures for our specific use case.",
        "Establish automated ML pipeline with continuous training, validation, and deployment.",
        "Configure distributed training across GPU cluster to reduce training time by 40%.",
        "Develop reinforcement learning model for dynamic optimization problem."
      ],
      soft: [
        "Create comprehensive documentation for all production ML models including limitations.",
        "Develop framework for explaining model decisions to non-technical stakeholders.",
        "Successfully collaborate with product teams to align ML capabilities with business needs.",
        "Create visualizations that effectively communicate complex data patterns to the business."
      ],
      leadership: [
        "Lead development of new ML model from research through production deployment.",
        "Establish mentoring program for junior ML engineers focusing on practical implementation.",
        "Define ML roadmap for a key product area with measurable objectives.",
        "Document model development standards that are adopted by the ML team."
      ],
      domain: [
        "Implement state-of-the-art NLP techniques to improve text processing capabilities.",
        "Develop computer vision models that achieve 95%+ accuracy for our specific use cases.",
        "Create time series forecasting models that outperform current solutions by 15%.",
        "Build recommendation system with improved engagement metrics vs. current solution."
      ]
    }
  };
  
  const roleCategory = descriptions[role][category as keyof typeof descriptions[typeof role]];
  return roleCategory[Math.floor(Math.random() * roleCategory.length)];
};

// Generate users for the system (HR, managers, employees)
export const generateUsers = (employees: Employee[]): User[] => {
  const users: User[] = [];
  
  // Convert employees to users
  employees.forEach(emp => {
    users.push({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      avatar: emp.avatar
    });
  });
  
  // Add HR and managers
  const hrCount = faker.number.int({ min: 2, max: 4 });
  for (let i = 0; i < hrCount; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "HR",
      avatar: faker.image.avatarGitHub()
    });
  }
  
  const managerCount = faker.number.int({ min: 3, max: 6 });
  for (let i = 0; i < managerCount; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "Manager",
      avatar: faker.image.avatarGitHub()
    });
  }
  
  return users;
};

// Initialize all data
export const initializeData = () => {
  const employees = generateEmployees(18);
  const performanceData = generatePerformanceData(employees);
  const insights = generateAIInsights(employees, performanceData);
  const developmentPlans = generateDevelopmentPlans(employees, insights);
  const users = generateUsers(employees);
  
  return {
    employees,
    performanceData,
    insights,
    developmentPlans,
    users,
    currentUser: users.find(user => user.role === "HR") || users[0]
  };
};

// Store data in localStorage
export const storeData = () => {
  const data = initializeData();
  localStorage.setItem("pmsData", JSON.stringify(data));
  return data;
};

// Retrieve data from localStorage or initialize if not present
export const getData = () => {
  const storedData = localStorage.getItem("pmsData");
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  return storeData();
};

// Reset all data
export const resetData = () => {
  return storeData();
};
