
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Mail,
  Calendar,
  Briefcase,
  Users,
  Award,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, performanceData, insights, developmentPlans, setSelectedEmployee } = useData();
  
  // Find the employee by ID
  const employee = employees.find(emp => emp.id === id);
  
  // If employee not found, redirect to employees page
  useEffect(() => {
    if (!employee) {
      navigate("/employees");
      toast({
        title: "Employee not found",
        description: "The requested employee profile does not exist.",
        variant: "destructive"
      });
    } else {
      setSelectedEmployee(employee);
    }
    
    return () => {
      setSelectedEmployee(null);
    };
  }, [employee, navigate, setSelectedEmployee]);
  
  if (!employee) {
    return null;
  }
  
  // Get performance data for this employee
  const employeePerformance = performanceData
    .filter(perf => perf.employeeId === employee.id)
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Format performance data for chart
  const performanceChartData = employeePerformance.map(perf => {
    const [year, month] = perf.month.split('-');
    return {
      month: `${parseInt(month)}/${year.slice(2)}`,
      rating: perf.rating,
    };
  });
  
  // Get insights for this employee
  const employeeInsights = insights
    .filter(insight => insight.employeeId === employee.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get development plan for this employee
  const developmentPlan = developmentPlans.find(plan => plan.employeeId === employee.id);
  
  // Get icon based on insight category
  const getInsightIcon = (category: string) => {
    switch (category) {
      case "strength":
        return <Award className="h-5 w-5 text-pms-green" />;
      case "improvement":
        return <Target className="h-5 w-5 text-pms-red" />;
      case "trend":
        return employee.role === "SDE" ? 
          <TrendingUp className="h-5 w-5 text-pms-blue" /> : 
          <TrendingDown className="h-5 w-5 text-pms-orange" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-pms-yellow" />;
      default:
        return <Lightbulb className="h-5 w-5 text-pms-teal" />;
    }
  };
  
  // Get badge style based on category
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "strength":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "improvement":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "trend":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "recommendation":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  // Get goal badge style based on status
  const getGoalBadgeStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Calculate average rating
  const averageRating = employeePerformance.length
    ? employeePerformance.reduce((sum, perf) => sum + perf.rating, 0) / employeePerformance.length
    : 0;

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate("/employees")}
        className="mb-2"
      >
        Back to Employees
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="h-24 w-24 rounded-full mb-4"
              />
              <CardTitle className="text-xl">{employee.name}</CardTitle>
              <Badge variant="outline" className="mt-2">
                {employee.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-500" />
                <span>Manager: {employee.manager}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="pt-2">
                <div className="text-sm text-gray-500 mb-1">Current Performance Rating</div>
                <div className="text-3xl font-bold text-pms-blue">{averageRating.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
            <CardDescription>
              6-month performance rating trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#1ABC9C" 
                    name="Performance Rating" 
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Insights</CardTitle>
            <CardDescription>
              Performance patterns and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {employeeInsights.length > 0 ? (
              <div className="space-y-4">
                {employeeInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-3 rounded-md border border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getInsightIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <h4 className="font-medium text-sm text-pms-blue">
                            {insight.title}
                          </h4>
                          <Badge className={getBadgeStyle(insight.category)}>
                            {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {insight.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <span>
                            {new Date(insight.date).toLocaleDateString()} • {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No insights available for this employee
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Development Plan</CardTitle>
            <CardDescription>
              Growth and improvement goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {developmentPlan ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Plan created: {new Date(developmentPlan.created).toLocaleDateString()}
                </div>
                
                {developmentPlan.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 rounded-md border border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm text-pms-blue">
                        {goal.title}
                      </h4>
                      <Badge className={getGoalBadgeStyle(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {goal.description}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">
                        {goal.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No development plan available for this employee
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfile;
