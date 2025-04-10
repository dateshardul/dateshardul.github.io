import { NavLink } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import {
  LayoutDashboard,
  LineChart,
  MessageSquare,
  School,
  Users,
  LogOut,
  Settings
} from "lucide-react";

const Sidebar = () => {
  const { currentUser } = useData();

  return (
    <aside className="bg-pms-blue text-white w-64 flex-shrink-0 hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pms-teal flex items-center justify-center text-white font-bold">
            PM
          </div>
          <div>
            <h2 className="font-semibold text-lg">PerformAI</h2>
            <p className="text-xs text-white/60">Performance Management</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-white/10 text-pms-teal"
                  : "text-white/80 hover:bg-white/5"
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/performance"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-white/10 text-pms-teal"
                  : "text-white/80 hover:bg-white/5"
              }`
            }
          >
            <LineChart className="h-5 w-5" />
            <span>Performance</span>
          </NavLink>

          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-white/10 text-pms-teal"
                  : "text-white/80 hover:bg-white/5"
              }`
            }
          >
            <MessageSquare className="h-5 w-5" />
            <span>Feedback</span>
          </NavLink>

          <NavLink
            to="/development"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-white/10 text-pms-teal"
                  : "text-white/80 hover:bg-white/5"
              }`
            }
          >
            <School className="h-5 w-5" />
            <span>Development</span>
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-white/10 text-pms-teal"
                  : "text-white/80 hover:bg-white/5"
              }`
            }
          >
            <Users className="h-5 w-5" />
            <span>Employees</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={currentUser?.avatar || 'https://github.com/identicons/app/gpui'} 
            alt="Profile" 
            className="h-8 w-8 rounded-full"
          />
          <div>
            <p className="font-medium text-sm">{currentUser?.name}</p>
            <p className="text-xs text-white/60">{currentUser?.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-white/60">
          <button className="flex items-center gap-1.5 hover:text-white">
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </button>
          <button 
            className="flex items-center gap-1.5 hover:text-white" 
            onClick={() => window.location.href = '/login'}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
