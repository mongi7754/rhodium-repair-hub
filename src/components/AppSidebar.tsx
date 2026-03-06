import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Receipt,
  Mic,
  Settings,
  LogOut,
  Menu,
  BarChart3,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/voice", label: "Voice Log", icon: Mic },
  { path: "/sales", label: "Sales", icon: TrendingUp },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/expenses", label: "Expenses", icon: Receipt },
  { path: "/fraud-monitor", label: "Fraud Monitor", icon: ShieldAlert },
  { path: "/settings", label: "Settings", icon: Settings },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))] transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--sidebar-primary))]" />
            <h1 className="text-lg font-extrabold text-[hsl(var(--sidebar-primary))]">
              BiasharaAI
            </h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-lg shadow-[hsl(var(--sidebar-primary))/20]"
                  : "hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-destructive/20 text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
