
import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import { ChevronRight, Lightbulb, TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AIInsightsList = () => {
  const { insights, employees } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Get the most recent insights
  const recentInsights = [...insights]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  const filteredInsights = selectedCategory === "all" 
    ? recentInsights 
    : recentInsights.filter(insight => insight.category === selectedCategory);
  
  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
  // Get icon based on insight category
  const getInsightIcon = (category: string) => {
    switch (category) {
      case "strength":
        return <Award className="h-5 w-5 text-pms-green" />;
      case "improvement":
        return <Target className="h-5 w-5 text-pms-red" />;
      case "trend":
        return <TrendingUp className="h-5 w-5 text-pms-blue" />;
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">AI-Generated Insights</CardTitle>
          <CardDescription>
            Recent performance patterns and recommendations
          </CardDescription>
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Insights</SelectItem>
            <SelectItem value="strength">Strengths</SelectItem>
            <SelectItem value="improvement">Improvements</SelectItem>
            <SelectItem value="trend">Trends</SelectItem>
            <SelectItem value="recommendation">Recommendations</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start p-3 rounded-md hover:bg-slate-50 transition-colors"
              >
                <div className="mr-4 mt-1">
                  {getInsightIcon(insight.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <h4 className="font-medium text-sm text-pms-blue">
                      {insight.title}
                    </h4>
                    <Badge variant="outline" className={getBadgeStyle(insight.category)}>
                      {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                    {insight.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>
                      {new Date(insight.date).toLocaleDateString()} • {getEmployeeName(insight.employeeId)}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/employees/${insight.employeeId}`}
                  className="ml-2 flex-shrink-0 text-pms-teal hover:text-pms-blue transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <Lightbulb className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No insights found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No insights found for the selected category.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsList;
