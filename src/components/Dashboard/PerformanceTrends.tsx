
import { useState } from "react";
import { useData } from "../../contexts/DataContext";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyAverageByRole {
  month: string;
  SDE?: number;
  "Product Manager"?: number;
  "ML Engineer"?: number;
}

const PerformanceTrends = () => {
  const { performanceData } = useData();
  const [metric, setMetric] = useState("rating");
  
  // Get unique months from performance data
  const months = [...new Set(performanceData.map(data => data.month))]
    .sort((a, b) => a.localeCompare(b));
  
  // Group data by month and role, then calculate averages
  const trendData: MonthlyAverageByRole[] = months.map(month => {
    const monthData = performanceData.filter(data => data.month === month);
    
    const sdeData = monthData.filter(data => data.metrics.codeQuality !== undefined);
    const pmData = monthData.filter(data => data.metrics.productImpact !== undefined);
    const mlData = monthData.filter(data => data.metrics.modelAccuracy !== undefined);
    
    const result: MonthlyAverageByRole = { month };
    
    if (sdeData.length) {
      if (metric === "rating") {
        result.SDE = sdeData.reduce((sum, data) => sum + data.rating, 0) / sdeData.length;
      } else if (metric === "onTimeDelivery") {
        result.SDE = sdeData.reduce((sum, data) => sum + (data.metrics.onTimeDelivery || 0), 0) / sdeData.length;
      } else if (metric === "codeQuality") {
        result.SDE = sdeData.reduce((sum, data) => sum + (data.metrics.codeQuality || 0), 0) / sdeData.length;
      }
    }
    
    if (pmData.length) {
      if (metric === "rating") {
        result["Product Manager"] = pmData.reduce((sum, data) => sum + data.rating, 0) / pmData.length;
      } else if (metric === "onTimeDelivery") {
        result["Product Manager"] = pmData.reduce((sum, data) => sum + (data.metrics.onTimeDelivery || 0), 0) / pmData.length;
      } else if (metric === "stakeholderSatisfaction") {
        result["Product Manager"] = pmData.reduce((sum, data) => sum + (data.metrics.stakeholderSatisfaction || 0), 0) / pmData.length;
      }
    }
    
    if (mlData.length) {
      if (metric === "rating") {
        result["ML Engineer"] = mlData.reduce((sum, data) => sum + data.rating, 0) / mlData.length;
      } else if (metric === "modelAccuracy") {
        result["ML Engineer"] = mlData.reduce((sum, data) => sum + (data.metrics.modelAccuracy || 0), 0) / mlData.length;
      } else if (metric === "dataQuality") {
        result["ML Engineer"] = mlData.reduce((sum, data) => sum + (data.metrics.dataQuality || 0), 0) / mlData.length;
      }
    }
    
    // Format month for display
    const [year, monthNum] = month.split('-');
    result.month = `${parseInt(monthNum)}/${year.slice(2)}`;
    
    return result;
  });

  const getYDomain = () => {
    if (metric === "rating") {
      return [0, 5];
    } else {
      return [0, 100];
    }
  };
  
  const getMetricName = () => {
    switch (metric) {
      case "rating":
        return "Performance Rating";
      case "onTimeDelivery":
        return "On-time Delivery %";
      case "codeQuality":
        return "Code Quality Score";
      case "stakeholderSatisfaction":
        return "Stakeholder Satisfaction";
      case "modelAccuracy":
        return "Model Accuracy %";
      case "dataQuality":
        return "Data Quality Score";
      default:
        return "Metric";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            6-month historical performance data by role
          </CardDescription>
        </div>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Performance Rating</SelectItem>
            <SelectItem value="onTimeDelivery">On-time Delivery</SelectItem>
            <SelectItem value="codeQuality">Code Quality (SDE)</SelectItem>
            <SelectItem value="stakeholderSatisfaction">Stakeholder Satisfaction (PM)</SelectItem>
            <SelectItem value="modelAccuracy">Model Accuracy (ML)</SelectItem>
            <SelectItem value="dataQuality">Data Quality (ML)</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={getYDomain()} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="SDE" 
                stroke="#2C3E50" 
                activeDot={{ r: 8 }} 
                name="SDE" 
              />
              <Line 
                type="monotone" 
                dataKey="Product Manager" 
                stroke="#1ABC9C" 
                activeDot={{ r: 8 }} 
                name="Product Manager" 
              />
              <Line 
                type="monotone" 
                dataKey="ML Engineer" 
                stroke="#F39C12" 
                activeDot={{ r: 8 }} 
                name="ML Engineer" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          {getMetricName()} tracked over the last 6 months
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrends;
