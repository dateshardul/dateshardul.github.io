
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import {
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  School,
  Users,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const { currentUser } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/performance':
        return 'Performance Metrics';
      case '/feedback':
        return 'Feedback Collection';
      case '/development':
        return 'Development Plans';
      case '/employees':
        return 'Employee Directory';
      default:
        if (location.pathname.startsWith('/employees/')) {
          return 'Employee Profile';
        }
        return 'Performance Management System';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-pms-blue">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative rounded-md shadow-sm max-w-xs hidden lg:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none focus:ring-2 focus:ring-pms-teal sm:text-sm sm:leading-6"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pms-teal">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="cursor-pointer py-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">New performance review</p>
                    <p className="text-sm text-gray-500">Q2 Reviews are now available.</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Feedback request</p>
                    <p className="text-sm text-gray-500">James Wong requested feedback.</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">AI insight generated</p>
                    <p className="text-sm text-gray-500">New insights available for your team.</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center text-pms-teal">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <img
                  src={currentUser?.avatar || 'https://github.com/identicons/app/gpui'}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="hidden md:inline-block font-medium">
                  {currentUser?.name?.split(' ')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-500"
                onClick={() => window.location.href = '/login'}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="bg-pms-blue text-white p-4 md:hidden fixed top-16 left-0 right-0 z-50">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/performance" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LineChart className="h-5 w-5" />
                <span>Performance</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/feedback" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Feedback</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/development" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <School className="h-5 w-5" />
                <span>Development</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/employees" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Employees</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/login" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
