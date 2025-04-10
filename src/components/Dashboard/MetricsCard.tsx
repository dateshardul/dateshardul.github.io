
import { useData } from "../../contexts/DataContext";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  metric: string;
  value: number;
  previousValue: number;
  format?: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const MetricsCard = ({
  title,
  metric,
  value,
  previousValue,
  format = "number",
  icon,
  colorClass = "bg-blue-100 text-blue-600",
}: MetricsCardProps) => {
  const percentChange = previousValue !== 0 
    ? ((value - previousValue) / previousValue) * 100 
    : 0;
  
  const isPositive = percentChange >= 0;
  const absChange = Math.abs(percentChange);
  
  const formatValue = (val: number) => {
    if (format === "percent") {
      return `${val.toFixed(1)}%`;
    } else if (format === "decimal") {
      return val.toFixed(1);
    } else {
      return val.toFixed(0);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${colorClass}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <p className="text-xs text-muted-foreground">{metric}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center">
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-rose-500 mr-1" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {absChange.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            from previous period
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MetricsCard;
