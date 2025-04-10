
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

const TopPerformers = () => {
  const { employees, performanceData } = useData();
  
  // Calculate average rating for each employee from the last 3 months
  const employeeRatings = employees.map(employee => {
    const employeePerformance = performanceData
      .filter(perf => perf.employeeId === employee.id)
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 3);
    
    if (employeePerformance.length === 0) return { employee, averageRating: 0 };
    
    const sum = employeePerformance.reduce((total, perf) => total + perf.rating, 0);
    const averageRating = sum / employeePerformance.length;
    
    return {
      employee,
      averageRating
    };
  });
  
  // Get top 5 performers
  const topPerformers = employeeRatings
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>
          Employees with the highest average performance ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topPerformers.map((item, index) => (
            <div key={item.employee.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 font-bold text-lg text-gray-400 w-6">
                  {index + 1}
                </div>
                <img
                  src={item.employee.avatar}
                  alt={item.employee.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{item.employee.name}</div>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs font-normal bg-slate-100">
                      {item.employee.role}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium text-lg">
                    {item.averageRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Average Rating</div>
                </div>
                <Link
                  to={`/employees/${item.employee.id}`}
                  className="text-pms-teal hover:text-pms-blue transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
