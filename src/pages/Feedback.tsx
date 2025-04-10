
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Bot, User as UserIcon, Users, UserCheck } from "lucide-react";

const Feedback = () => {
  const { employees, performanceData, currentUser } = useData();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFeedback, setNewFeedback] = useState("");

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);

  const feedbackItems = selectedEmployee
    ? performanceData
        .filter((perf) => perf.employeeId === selectedEmployee.id)
        .flatMap((perf) => perf.feedback)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const handleSubmitFeedback = () => {
    alert("Feedback submitted!");
    setNewFeedback("");
  };

  const getFeedbackIcon = (category: string) => {
    switch (category) {
      case "peer":
        return <Users className="h-4 w-4" />;
      case "manager":
        return <UserCheck className="h-4 w-4" />;
      case "self":
        return <UserIcon className="h-4 w-4" />;
      case "system":
        return <Bot className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Feedback</h2>
        <p className="text-muted-foreground">
          View and provide feedback for team members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Select an employee to view or provide feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`flex items-center p-2 rounded cursor-pointer hover:bg-slate-100 ${
                      selectedEmployeeId === employee.id ? "bg-slate-100" : ""
                    }`}
                    onClick={() => setSelectedEmployeeId(employee.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedEmployee ? (
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedEmployee.name}</CardTitle>
                  <CardDescription>
                    {selectedEmployee.role} · {selectedEmployee.department}
                  </CardDescription>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                  />
                  <AvatarFallback>{selectedEmployee.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view">
                <TabsList className="mb-4">
                  <TabsTrigger value="view">View Feedback</TabsTrigger>
                  <TabsTrigger value="provide">Provide Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="view">
                  <div className="space-y-6">
                    {feedbackItems.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No feedback available for this employee.
                      </p>
                    ) : (
                      feedbackItems.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${getSentimentColor(
                                  feedback.sentiment
                                )}`}
                              ></div>
                              <Badge variant="outline" className="mr-2">
                                <span className="flex items-center gap-1">
                                  {getFeedbackIcon(feedback.category)}
                                  {feedback.category.charAt(0).toUpperCase() +
                                    feedback.category.slice(1)}
                                </span>
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                From: {feedback.from}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(feedback.date), "MMM d, yyyy")}
                            </span>
                          </div>
                          <p>{feedback.text}</p>
                          {feedback.topics && (
                            <div className="flex gap-2 flex-wrap">
                              {feedback.topics.map((topic, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="provide">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Your Feedback
                      </label>
                      <Textarea
                        placeholder="Provide specific, constructive feedback about this employee's performance..."
                        className="min-h-[150px]"
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSubmitFeedback} disabled={!newFeedback.trim()}>
                      Submit Feedback
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Select an employee to view or provide feedback
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Feedback;
