import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  Brain,
  BarChart3,
  Settings,
  Menu,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Core",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/wallet", label: "Wallet", icon: Wallet },
      { path: "/pos", label: "Smart POS", icon: ShoppingBag },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { path: "/ai-assistant", label: "AI Assistant", icon: Brain },
      { path: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { path: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const FlowMintSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col glass-sidebar border-r border-[hsl(var(--sidebar-border))] transition-all duration-300 overflow-y-auto",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--sidebar-border))]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-mint flex items-center justify-center shadow-lg glow-mint">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gradient-mint font-mono tracking-wider">
                FlowMint
              </h1>
              <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-50">
                AI Financial Intelligence
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--sidebar-foreground))] opacity-30">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "gradient-mint text-white shadow-lg glow-mint"
                        : "hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] opacity-70 hover:opacity-100"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Status */}
      {!collapsed && (
        <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-2 px-2">
            <span className="status-dot status-active pulse-live" />
            <span className="text-xs text-[hsl(var(--sidebar-foreground))] opacity-50">
              AI Engine Active
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FlowMintSidebar;
