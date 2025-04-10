
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getData, resetData } from "../lib/data-generator";
import { 
  Employee, 
  PerformanceData, 
  AIInsight, 
  DevelopmentPlan, 
  User 
} from "../lib/types";

interface DataContextType {
  employees: Employee[];
  performanceData: PerformanceData[];
  insights: AIInsight[];
  developmentPlans: DevelopmentPlan[];
  users: User[];
  currentUser: User | null;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  isLoading: boolean;
  resetAppData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data on mount
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const data = getData();
      setEmployees(data.employees);
      setPerformanceData(data.performanceData);
      setInsights(data.insights);
      setDevelopmentPlans(data.developmentPlans);
      setUsers(data.users);
      setCurrentUser(data.currentUser);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAppData = () => {
    setIsLoading(true);
    try {
      const data = resetData();
      setEmployees(data.employees);
      setPerformanceData(data.performanceData);
      setInsights(data.insights);
      setDevelopmentPlans(data.developmentPlans);
      setUsers(data.users);
      setCurrentUser(data.currentUser);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error resetting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        performanceData,
        insights,
        developmentPlans,
        users,
        currentUser,
        selectedEmployee,
        setSelectedEmployee,
        isLoading,
        resetAppData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
