
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-pms-teal mb-4" />
      <h2 className="text-xl font-medium text-pms-blue">Loading Performance Management System</h2>
      <p className="text-muted-foreground mt-2">Preparing your performance data...</p>
    </div>
  );
};

export default Loading;
