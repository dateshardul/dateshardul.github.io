
import { useData } from "../../contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PerformanceSummary = () => {
  const { employees, performanceData } = useData();
  
  // Process data for role distribution chart
  const roleDistribution = employees.reduce((acc: Record<string, number>, employee) => {
    acc[employee.role] = (acc[employee.role] || 0) + 1;
    return acc;
  }, {});
  
  const roleChartData = Object.entries(roleDistribution).map(([role, count]) => ({
    role,
    count,
  }));

  // Process data for average performance by role
  const performanceByRole: Record<string, { total: number, count: number }> = {};
  
  // Get the latest month's data for each employee
  employees.forEach(employee => {
    const latestPerformance = performanceData
      .filter(perf => perf.employeeId === employee.id)
      .sort((a, b) => b.month.localeCompare(a.month))[0];
    
    if (latestPerformance) {
      if (!performanceByRole[employee.role]) {
        performanceByRole[employee.role] = { total: 0, count: 0 };
      }
      
      performanceByRole[employee.role].total += latestPerformance.rating;
      performanceByRole[employee.role].count += 1;
    }
  });
  
  const performanceChartData = Object.entries(performanceByRole).map(([role, data]) => ({
    role,
    averageRating: data.total / data.count,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Role Distribution</CardTitle>
          <CardDescription>
            Current team composition across different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="role" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1ABC9C" name="Employees" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Average Performance by Role</CardTitle>
          <CardDescription>
            Current average performance rating across roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageRating" fill="#F39C12" name="Avg Rating" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSummary;
