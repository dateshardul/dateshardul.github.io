
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Performance = () => {
  const { employees, performanceData } = useData();
  const [selectedRole, setSelectedRole] = useState<string>("SDE");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  
  // Get unique months
  const months = [...new Set(performanceData.map(data => data.month))]
    .sort((a, b) => b.localeCompare(a));
  
  // Set default month if not set
  if (!selectedMonth && months.length > 0) {
    setSelectedMonth(months[0]);
  }
  
  // Filter employees by selected role
  const filteredEmployees = employees.filter(emp => emp.role === selectedRole);
  
  // Get performance data for selected month and role
  const filteredPerformance = performanceData.filter(
    perf => perf.month === selectedMonth && 
    filteredEmployees.some(emp => emp.id === perf.employeeId)
  );
  
  // Calculate average metrics for radar chart
  const getAverageMetrics = () => {
    if (filteredPerformance.length === 0) return [];
    
    const metricKeys = Object.keys(filteredPerformance[0].metrics).filter(
      key => {
        const typedKey = key as keyof typeof filteredPerformance[0]["metrics"];
        return filteredPerformance[0].metrics[typedKey] !== undefined;
      }
    );
    
    return metricKeys.map(key => {
      const sum = filteredPerformance.reduce((total, perf) => {
        const typedKey = key as keyof typeof perf["metrics"];
        const value = perf.metrics[typedKey];
        return total + (value || 0);
      }, 0);
      
      return {
        metric: formatMetricName(key),
        value: sum / filteredPerformance.length,
      };
    });
  };
  
  const formatMetricName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };
  
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4) return "text-emerald-600";
    if (rating >= 3) return "text-amber-600";
    if (rating >= 2) return "text-orange-600";
    return "text-red-600";
  };
  
  const getMetricDescription = (metricKey: string) => {
    const descriptions: Record<string, string> = {
      codeQuality: "Quality and maintainability of written code",
      velocity: "Story points completed per sprint",
      commitFrequency: "Average commits per week",
      pullRequestsReviewed: "Number of PRs reviewed per week",
      bugsIntroduced: "Bugs attributed to engineer's code",
      onTimeDelivery: "Percentage of work delivered on schedule",
      
      productImpact: "Impact of product decisions on business metrics",
      stakeholderSatisfaction: "Satisfaction ratings from key stakeholders",
      requirementQuality: "Clarity and completeness of requirements",
      decisionsTimeliness: "Speed and efficiency of decision making",
      
      modelAccuracy: "Percentage accuracy of ML models",
      experimentVelocity: "Number of experiments conducted",
      paperContributions: "Contributions to research papers",
      dataQuality: "Quality of data preparation and cleaning",
      modelDeployments: "Number of models deployed to production"
    };
    
    return descriptions[metricKey] || "Performance metric";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Metrics</h2>
        <p className="text-muted-foreground">
          Detailed performance metrics and analytics by role
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SDE">Software Development Engineers</SelectItem>
            <SelectItem value="Product Manager">Product Managers</SelectItem>
            <SelectItem value="ML Engineer">ML Engineers</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => {
              const [year, monthNum] = month.split('-');
              const monthName = new Date(
                parseInt(year),
                parseInt(monthNum) - 1
              ).toLocaleString('default', { month: 'long' });
              
              return (
                <SelectItem key={month} value={month}>
                  {monthName} {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selectedRole} Performance Profile</CardTitle>
            <CardDescription>
              Average performance metrics across all {selectedRole}s
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={getAverageMetrics()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name={`${selectedRole} Average`}
                    dataKey="value"
                    stroke="#1ABC9C"
                    fill="#1ABC9C"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Metric Definitions</CardTitle>
            <CardDescription>
              Understanding the performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <div className="space-y-4">
              {filteredPerformance.length > 0 && Object.keys(filteredPerformance[0]?.metrics || {})
                .filter(key => {
                  const typedKey = key as keyof typeof filteredPerformance[0]["metrics"];
                  return filteredPerformance[0]?.metrics[typedKey] !== undefined;
                })
                .map(metricKey => (
                  <div key={metricKey} className="pb-2 border-b border-gray-100 last:border-0">
                    <h4 className="font-medium text-pms-blue">
                      {formatMetricName(metricKey)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {getMetricDescription(metricKey)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance Data</CardTitle>
          <CardDescription>
            Detailed metrics for each {selectedRole} for {selectedMonth}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                  {filteredPerformance.length > 0 && Object.keys(filteredPerformance[0].metrics)
                    .filter(key => {
                      const typedKey = key as keyof typeof filteredPerformance[0]["metrics"];
                      return filteredPerformance[0].metrics[typedKey] !== undefined;
                    })
                    .map(key => (
                      <TableHead key={key} className="text-right">
                        {formatMetricName(key)}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPerformance.map(perf => {
                  const employee = employees.find(emp => emp.id === perf.employeeId);
                  
                  return (
                    <TableRow key={perf.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee?.avatar || ""}
                            alt={employee?.name || ""}
                            className="h-8 w-8 rounded-full"
                          />
                          <span>{employee?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold text-lg ${getRatingColor(perf.rating)}`}>
                          {perf.rating.toFixed(1)}
                        </span>
                      </TableCell>
                      {Object.entries(perf.metrics)
                        .filter(([key, value]) => value !== undefined)
                        .map(([key, value]) => (
                          <TableCell key={key} className="text-right">
                            <Badge variant="outline" className="font-mono">
                              {typeof value === 'number' ? value.toFixed(1) : value}
                            </Badge>
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
