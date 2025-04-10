
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot, Cpu, Database, LineChart, RefreshCcw, Settings, UserCog } from "lucide-react";

const Admin = () => {
  const { resetAppData, employees } = useData();
  const { toast } = useToast();
  const [performanceDistribution, setPerformanceDistribution] = useState<number[]>([50]);
  const [feedbackVolume, setFeedbackVolume] = useState<number[]>([5]);
  const [trendStrength, setTrendStrength] = useState<number[]>([5]);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");
  const [scenarios, setScenarios] = useState([
    {
      id: "1",
      name: "Productivity Boost",
      description: "Simulate 20% improvement in all metrics over 3 months",
      affectedEmployees: ["All SDEs"],
      performanceShift: 20,
      duration: 3,
      active: false,
    },
    {
      id: "2",
      name: "Market Downturn",
      description: "Simulate decreased stakeholder satisfaction for PMs",
      affectedEmployees: ["All Product Managers"],
      performanceShift: -15,
      duration: 2,
      active: false,
    },
  ]);

  const handleGenerateNewData = () => {
    resetAppData();
    toast({
      title: "Data Regenerated",
      description: "New synthetic data has been generated with current parameters",
    });
  };

  const handleAddScenario = () => {
    if (!scenarioName) return;
    
    setScenarios([
      ...scenarios,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: scenarioName,
        description: scenarioDescription,
        affectedEmployees: ["Selected employees"],
        performanceShift: 10,
        duration: 3,
        active: false,
      },
    ]);
    
    setScenarioName("");
    setScenarioDescription("");
    
    toast({
      title: "Scenario Added",
      description: "New simulation scenario has been created",
    });
  };

  const toggleScenarioStatus = (id: string) => {
    setScenarios(
      scenarios.map((scenario) =>
        scenario.id === id
          ? { ...scenario, active: !scenario.active }
          : scenario
      )
    );
    
    toast({
      title: "Scenario Updated",
      description: "Simulation scenario status has been toggled",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
        <p className="text-muted-foreground">
          Control synthetic data generation and simulation scenarios
        </p>
      </div>

      <Tabs defaultValue="generator">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">
            <Database className="mr-2 h-4 w-4" />
            Data Generator
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            <LineChart className="mr-2 h-4 w-4" />
            Simulation Scenarios
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Bot className="mr-2 h-4 w-4" />
            AI Models
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Generation Parameters</CardTitle>
              <CardDescription>
                Configure how synthetic performance data is generated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Performance Distribution</Label>
                    <span className="text-muted-foreground">{performanceDistribution[0]}%</span>
                  </div>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    value={performanceDistribution}
                    onValueChange={setPerformanceDistribution}
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Lower performers</span>
                    <span>Balanced</span>
                    <span>Higher performers</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Feedback Volume</Label>
                    <span className="text-muted-foreground">{feedbackVolume[0]}</span>
                  </div>
                  <Slider
                    defaultValue={[5]}
                    max={10}
                    step={1}
                    value={feedbackVolume}
                    onValueChange={setFeedbackVolume}
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Minimal</span>
                    <span>Medium</span>
                    <span>Abundant</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Trend Strength</Label>
                    <span className="text-muted-foreground">{trendStrength[0]}</span>
                  </div>
                  <Slider
                    defaultValue={[5]}
                    max={10}
                    step={1}
                    value={trendStrength}
                    onValueChange={setTrendStrength}
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Subtle</span>
                    <span>Moderate</span>
                    <span>Dramatic</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Role Distribution</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">SDEs</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue placeholder="Percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="40">40%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                          <SelectItem value="60">60%</SelectItem>
                          <SelectItem value="70">70%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">PMs</Label>
                      <Select defaultValue="20">
                        <SelectTrigger>
                          <SelectValue placeholder="Percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          <SelectItem value="40">40%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">ML Engineers</Label>
                      <Select defaultValue="20">
                        <SelectTrigger>
                          <SelectValue placeholder="Percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          <SelectItem value="40">40%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGenerateNewData}
                className="w-full"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Regenerate Data with These Parameters
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Demo Profiles</CardTitle>
              <CardDescription>
                Pre-configured employee profiles with specific performance patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Rising Star SDE</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Shows consistent improvement over 6 months, high code quality
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Generate</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Struggling PM</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Strong start with declining stakeholder satisfaction
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Generate</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Expert ML Engineer</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Consistently high model accuracy but low experimentation
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Generate</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Scenarios</CardTitle>
              <CardDescription>
                Create and run performance change simulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add New Scenario</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Simulation Scenario</DialogTitle>
                    <DialogDescription>
                      Define a new scenario to simulate performance changes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="scenario-name">Scenario Name</Label>
                      <Input
                        id="scenario-name"
                        placeholder="E.g., Team Training Impact"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scenario-description">Description</Label>
                      <Input
                        id="scenario-description"
                        placeholder="Describe what this scenario simulates"
                        value={scenarioDescription}
                        onChange={(e) => setScenarioDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Affected Employees</Label>
                      <Select defaultValue="all-sde">
                        <SelectTrigger>
                          <SelectValue placeholder="Select employees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-sde">All SDEs</SelectItem>
                          <SelectItem value="all-pm">All Product Managers</SelectItem>
                          <SelectItem value="all-ml">All ML Engineers</SelectItem>
                          <SelectItem value="custom">Custom Selection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Performance Change</Label>
                      <div className="flex items-center space-x-2">
                        <Select defaultValue="improve">
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="improve">Improve</SelectItem>
                            <SelectItem value="decline">Decline</SelectItem>
                          </SelectContent>
                        </Select>
                        <span>by</span>
                        <Select defaultValue="10">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="15">15%</SelectItem>
                            <SelectItem value="20">20%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (months)</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 month</SelectItem>
                          <SelectItem value="2">2 months</SelectItem>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddScenario}>Create Scenario</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Affects</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scenarios.map((scenario) => (
                    <TableRow key={scenario.id}>
                      <TableCell className="font-medium">{scenario.name}</TableCell>
                      <TableCell>{scenario.description}</TableCell>
                      <TableCell>{scenario.affectedEmployees.join(", ")}</TableCell>
                      <TableCell>
                        {scenario.performanceShift > 0 ? "+" : ""}
                        {scenario.performanceShift}% over {scenario.duration} months
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={scenario.active}
                          onCheckedChange={() => toggleScenarioStatus(scenario.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Configure AI models used for insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">NLP Feedback Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Extracts sentiment and topics from feedback text
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Performance Prediction</h3>
                      <p className="text-sm text-muted-foreground">
                        Predicts future performance based on trends
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Skill Gap Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Identifies skill gaps based on performance metrics
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Development Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Suggests personalized development plans
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>AI Insight Confidence Threshold</Label>
                <Slider
                  defaultValue={[70]}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Low (50%)</span>
                  <span>Medium (75%)</span>
                  <span>High (95%)</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Cpu className="mr-2 h-4 w-4" />
                Retrain AI Models with Current Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
