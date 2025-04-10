
import { useData } from "../../contexts/DataContext";
import MetricsCard from "./MetricsCard";
import { Users, Award, TrendingUp, Clock } from "lucide-react";

const MetricsSummary = () => {
  const { performanceData, employees } = useData();
  
  // Group performance data by month
  const monthlyData = performanceData.reduce((acc: Record<string, any[]>, data) => {
    if (!acc[data.month]) {
      acc[data.month] = [];
    }
    acc[data.month].push(data);
    return acc;
  }, {});
  
  // Sort months in descending order
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    return b.localeCompare(a);
  });

  // Get current and previous month data
  const currentMonth = sortedMonths[0];
  const previousMonth = sortedMonths[1];
  
  const currentData = monthlyData[currentMonth] || [];
  const previousData = monthlyData[previousMonth] || [];
  
  // Calculate metrics
  
  // 1. Average rating
  const currentAvgRating = currentData.length 
    ? currentData.reduce((sum, data) => sum + data.rating, 0) / currentData.length
    : 0;
  
  const previousAvgRating = previousData.length
    ? previousData.reduce((sum, data) => sum + data.rating, 0) / previousData.length
    : 0;

  // 2. High performers (rating >= 4)
  const currentHighPerformers = currentData.filter(data => data.rating >= 4).length;
  const previousHighPerformers = previousData.filter(data => data.rating >= 4).length;
  
  // 3. Improving performers
  const improvingPerformers = employees.filter(employee => {
    const employeeCurrentData = currentData.find(data => data.employeeId === employee.id);
    const employeePreviousData = previousData.find(data => data.employeeId === employee.id);
    
    return employeeCurrentData && 
           employeePreviousData && 
           employeeCurrentData.rating > employeePreviousData.rating;
  }).length;
  
  const previousImprovingPerformers = employees.filter(employee => {
    const employeePreviousData = previousData.find(data => data.employeeId === employee.id);
    const employeeTwoMonthsAgoData = monthlyData[sortedMonths[2]]?.find(data => data.employeeId === employee.id);
    
    return employeePreviousData && 
           employeeTwoMonthsAgoData && 
           employeePreviousData.rating > employeeTwoMonthsAgoData.rating;
  }).length;
  
  // 4. Average on-time delivery
  const currentOnTimeDelivery = currentData.length 
    ? currentData.reduce((sum, data) => {
        const onTime = data.metrics.onTimeDelivery || 0;
        return sum + onTime;
      }, 0) / currentData.length
    : 0;
  
  const previousOnTimeDelivery = previousData.length
    ? previousData.reduce((sum, data) => {
        const onTime = data.metrics.onTimeDelivery || 0;
        return sum + onTime;
      }, 0) / previousData.length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Average Rating"
        metric="Team performance score"
        value={currentAvgRating}
        previousValue={previousAvgRating}
        format="decimal"
        icon={<Award className="h-4 w-4" />}
        colorClass="bg-amber-100 text-amber-600"
      />
      
      <MetricsCard
        title="High Performers"
        metric="Employees rated 4+"
        value={currentHighPerformers}
        previousValue={previousHighPerformers}
        icon={<Users className="h-4 w-4" />}
        colorClass="bg-blue-100 text-blue-600"
      />
      
      <MetricsCard
        title="Improving"
        metric="Employees with positive trends"
        value={improvingPerformers}
        previousValue={previousImprovingPerformers}
        icon={<TrendingUp className="h-4 w-4" />}
        colorClass="bg-emerald-100 text-emerald-600"
      />
      
      <MetricsCard
        title="On-time Delivery"
        metric="Average across team"
        value={currentOnTimeDelivery}
        previousValue={previousOnTimeDelivery}
        format="percent"
        icon={<Clock className="h-4 w-4" />}
        colorClass="bg-indigo-100 text-indigo-600"
      />
    </div>
  );
};

export default MetricsSummary;
