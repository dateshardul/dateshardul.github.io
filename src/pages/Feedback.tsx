
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, User, Users, Robot } from "lucide-react";

const Feedback = () => {
  const { employees, performanceData } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("peer");
  
  const handleSubmitFeedback = () => {
    if (!selectedEmployee) {
      toast({
        title: "No employee selected",
        description: "Please select an employee to submit feedback for.",
        variant: "destructive",
      });
      return;
    }
    
    if (!feedbackText.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please provide feedback text.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would save to the backend
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been recorded successfully.",
    });
    
    // Reset form
    setFeedbackText("");
  };
  
  // Get all feedback from the latest month
  const latestMonth = [...new Set(performanceData.map(data => data.month))]
    .sort((a, b) => b.localeCompare(a))[0];
  
  const allFeedback = performanceData
    .filter(data => data.month === latestMonth)
    .flatMap(data => data.feedback.map(fb => ({
      ...fb,
      employeeId: data.employeeId,
    })));
  
  // Group feedback by category
  const peerFeedback = allFeedback.filter(fb => fb.category === "peer");
  const managerFeedback = allFeedback.filter(fb => fb.category === "manager");
  const selfFeedback = allFeedback.filter(fb => fb.category === "self");
  const systemFeedback = allFeedback.filter(fb => fb.category === "system");
  
  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || "Unknown Employee";
  };
  
  // Get feedback icon
  const getFeedbackIcon = (category: string) => {
    switch (category) {
      case "peer":
        return <Users className="h-5 w-5 text-pms-blue" />;
      case "manager":
        return <User className="h-5 w-5 text-pms-teal" />;
      case "self":
        return <User className="h-5 w-5 text-pms-orange" />;
      case "system":
        return <Robot className="h-5 w-5 text-pms-purple" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get badge style based on sentiment
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case "negative":
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
      case "neutral":
        return <Badge className="bg-blue-100 text-blue-800">Neutral</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Feedback Collection</h2>
        <p className="text-muted-foreground">
          Review and provide feedback for team members
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Provide Feedback</CardTitle>
            <CardDescription>
              Submit feedback for a team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Employee</label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Employees</SelectLabel>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback Type</label>
                <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peer">Peer Feedback</SelectItem>
                    <SelectItem value="manager">Manager Feedback</SelectItem>
                    <SelectItem value="self">Self-Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback</label>
                <Textarea 
                  placeholder="Provide your feedback here..." 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                className="w-full bg-pms-teal hover:bg-pms-teal/90"
                onClick={handleSubmitFeedback}
              >
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>
              Feedback collected for the current period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="peer">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="peer" className="flex-1">Peer ({peerFeedback.length})</TabsTrigger>
                <TabsTrigger value="manager" className="flex-1">Manager ({managerFeedback.length})</TabsTrigger>
                <TabsTrigger value="self" className="flex-1">Self ({selfFeedback.length})</TabsTrigger>
                <TabsTrigger value="system" className="flex-1">System ({systemFeedback.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="peer" className="space-y-4 mt-0">
                <div className="flex mb-4">
                  <Input className="max-w-sm" placeholder="Search peer feedback..." />
                </div>
                {peerFeedback.slice(0, 5).map(feedback => (
                  <div
                    key={feedback.id}
                    className="p-3 rounded-md border border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getFeedbackIcon("peer")}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <div className="font-medium text-sm">
                            For: {getEmployeeName(feedback.employeeId)}
                          </div>
                          {getSentimentBadge(feedback.sentiment)}
                        </div>
                        <p className="text-sm text-gray-600">
                          "{feedback.text}"
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>From: {feedback.from}</span>
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="manager" className="space-y-4 mt-0">
                {managerFeedback.slice(0, 5).map(feedback => (
                  <div
                    key={feedback.id}
                    className="p-3 rounded-md border border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getFeedbackIcon("manager")}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <div className="font-medium text-sm">
                            For: {getEmployeeName(feedback.employeeId)}
                          </div>
                          {getSentimentBadge(feedback.sentiment)}
                        </div>
                        <p className="text-sm text-gray-600">
                          "{feedback.text}"
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>From: {feedback.from} (Manager)</span>
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="self" className="space-y-4 mt-0">
                {selfFeedback.slice(0, 5).map(feedback => (
                  <div
                    key={feedback.id}
                    className="p-3 rounded-md border border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getFeedbackIcon("self")}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <div className="font-medium text-sm">
                            For: {getEmployeeName(feedback.employeeId)}
                          </div>
                          {getSentimentBadge(feedback.sentiment)}
                        </div>
                        <p className="text-sm text-gray-600">
                          "{feedback.text}"
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>Self-assessment</span>
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="system" className="space-y-4 mt-0">
                {systemFeedback.slice(0, 5).map(feedback => (
                  <div
                    key={feedback.id}
                    className="p-3 rounded-md border border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getFeedbackIcon("system")}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <div className="font-medium text-sm">
                            For: {getEmployeeName(feedback.employeeId)}
                          </div>
                          {getSentimentBadge(feedback.sentiment)}
                        </div>
                        <p className="text-sm text-gray-600">
                          "{feedback.text}"
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>AI-Generated</span>
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
