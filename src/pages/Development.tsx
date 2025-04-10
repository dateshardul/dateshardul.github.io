
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { Link } from "react-router-dom";

const Development = () => {
  const { employees, developmentPlans } = useData();
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter plans based on role and search
  const filteredPlans = developmentPlans.filter(plan => {
    const employee = employees.find(emp => emp.id === plan.employeeId);
    
    if (!employee) return false;
    
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plan.goals.some(goal => goal.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesRole && matchesSearch;
  });
  
  // Calculate plan progress
  const calculateProgress = (plan: typeof developmentPlans[0]) => {
    if (plan.goals.length === 0) return 0;
    
    const completed = plan.goals.filter(goal => goal.status === "completed").length;
    return Math.round((completed / plan.goals.length) * 100);
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "not-started":
        return <CircleDashed className="h-5 w-5 text-gray-400" />;
      default:
        return <CircleDashed className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Development Plans</h2>
        <p className="text-muted-foreground">
          Career growth and professional development goals
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search development plans..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="SDE">SDE</SelectItem>
            <SelectItem value="Product Manager">Product Manager</SelectItem>
            <SelectItem value="ML Engineer">ML Engineer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => {
          const employee = employees.find(emp => emp.id === plan.employeeId);
          if (!employee) return null;
          
          const progress = calculateProgress(plan);
          
          return (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="mb-2">
                    {employee.role}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(plan.created).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>{employee.department}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Progress</div>
                  <div className="text-sm text-gray-500">{progress}%</div>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="mt-4 space-y-3">
                  {plan.goals.slice(0, 3).map(goal => (
                    <div 
                      key={goal.id}
                      className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="mt-0.5">
                        {getStatusIcon(goal.status)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{goal.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {plan.goals.length > 3 && (
                    <div className="text-center text-xs text-gray-500 pt-2">
                      +{plan.goals.length - 3} more goals
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Link
                  to={`/employees/${employee.id}`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {filteredPlans.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-900">No development plans found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default Development;
