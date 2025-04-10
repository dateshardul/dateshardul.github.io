
import { useData } from "../contexts/DataContext";
import MetricsSummary from "../components/Dashboard/MetricsSummary";
import PerformanceSummary from "../components/Dashboard/PerformanceSummary";
import TopPerformers from "../components/Dashboard/TopPerformers";
import PerformanceTrends from "../components/Dashboard/PerformanceTrends";
import AIInsightsList from "../components/Dashboard/AIInsightsList";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Dashboard = () => {
  const { resetAppData, isLoading } = useData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of team performance metrics and AI-driven insights
          </p>
        </div>
        <Button 
          onClick={resetAppData}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Regenerate Data
        </Button>
      </div>
      
      <MetricsSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceTrends />
        <PerformanceSummary />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIInsightsList />
        </div>
        <div>
          <TopPerformers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
