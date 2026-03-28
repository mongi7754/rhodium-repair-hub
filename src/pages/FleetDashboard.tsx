import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Route, Users, Fuel, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const FleetDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeTrips: 0,
    totalDrivers: 0,
    unresolvedAlerts: 0,
    completedToday: 0,
    avgFuelEfficiency: 0,
  });
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const [vehiclesRes, tripsRes, driversRes, alertsRes] = await Promise.all([
      supabase.from("vehicles").select("id, status").eq("user_id", DEMO_USER_ID),
      supabase.from("trips").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false }).limit(10),
      supabase.from("fleet_drivers").select("id, status").eq("user_id", DEMO_USER_ID),
      supabase.from("fleet_alerts").select("*").eq("user_id", DEMO_USER_ID).eq("is_resolved", false).order("created_at", { ascending: false }).limit(5),
    ]);

    const vehicles = vehiclesRes.data || [];
    const trips = tripsRes.data || [];
    const drivers = driversRes.data || [];
    const alerts = alertsRes.data || [];

    const today = new Date().toISOString().split("T")[0];
    const completedToday = trips.filter(
      (t) => t.status === "completed" && t.end_time?.startsWith(today)
    ).length;

    setStats({
      totalVehicles: vehicles.length,
      activeTrips: trips.filter((t) => t.status === "in_progress").length,
      totalDrivers: drivers.length,
      unresolvedAlerts: alerts.length,
      completedToday,
      avgFuelEfficiency: 0,
    });
    setRecentTrips(trips.slice(0, 5));
    setRecentAlerts(alerts);
  };

  const statCards = [
    { label: "Total Vehicles", value: stats.totalVehicles, icon: Truck, color: "text-primary" },
    { label: "Active Trips", value: stats.activeTrips, icon: Route, color: "text-secondary" },
    { label: "Drivers", value: stats.totalDrivers, icon: Users, color: "text-accent" },
    { label: "Completed Today", value: stats.completedToday, icon: CheckCircle, color: "text-success" },
    { label: "Alerts", value: stats.unresolvedAlerts, icon: AlertTriangle, color: "text-destructive" },
    { label: "Efficiency", value: "—", icon: TrendingUp, color: "text-warning" },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      assigned: "bg-muted text-muted-foreground",
      in_progress: "bg-primary/10 text-primary",
      completed: "bg-success/10 text-success",
      cancelled: "bg-destructive/10 text-destructive",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  const getSeverityBadge = (severity: string) => {
    const map: Record<string, string> = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-warning/10 text-warning",
      high: "bg-destructive/10 text-destructive",
      critical: "bg-destructive text-destructive-foreground",
    };
    return map[severity] || "bg-muted text-muted-foreground";
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Fleet Command Center</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of your fleet operations</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold font-mono">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Trips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Route className="h-4 w-4 text-primary" />
                Recent Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTrips.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No trips yet. Create your first trip to get started.</p>
              ) : (
                <div className="space-y-3">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="min-w-0">
                        <p className="text-sm font-medium font-mono">{trip.trip_code}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {trip.origin_name || "Origin"} → {trip.destination_name || "Destination"}
                        </p>
                      </div>
                      <Badge className={getStatusBadge(trip.status)}>{trip.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All clear — no active alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <Badge className={getSeverityBadge(alert.severity)}>{alert.severity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FleetLayout>
  );
};

export default FleetDashboard;
