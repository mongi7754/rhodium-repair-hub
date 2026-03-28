import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  Fuel,
  Bell,
  BarChart3,
  Settings,
  Menu,
  MapPin,
  Shield,
  Wrench,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/live-map", label: "Live Map", icon: MapPin },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/fleet", label: "Fleet", icon: Truck },
      { path: "/trips", label: "Trips", icon: Route },
      { path: "/drivers", label: "Drivers", icon: Users },
      { path: "/deliveries", label: "Deliveries", icon: Package },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { path: "/fuel", label: "Fuel Monitor", icon: Fuel },
      { path: "/alerts", label: "Alerts", icon: Bell },
      { path: "/reports", label: "Reports", icon: BarChart3 },
      { path: "/maintenance", label: "Maintenance", icon: Wrench },
    ],
  },
  {
    label: "System",
    items: [
      { path: "/geofences", label: "Geofences", icon: Shield },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const FleetSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))] transition-all duration-300 overflow-y-auto",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--sidebar-border))]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-fleet flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[hsl(var(--sidebar-primary))] font-mono tracking-wider">
                FleetIQ
              </h1>
              <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-60">
                AI Fleet Intelligence
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
      <nav className="flex-1 px-2 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-foreground))] opacity-40">
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
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-lg"
                        : "hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]"
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

      {/* Status bar */}
      {!collapsed && (
        <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-2 px-2">
            <span className="status-dot status-active pulse-live" />
            <span className="text-xs text-[hsl(var(--sidebar-foreground))] opacity-60">
              System Online
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FleetSidebar;
