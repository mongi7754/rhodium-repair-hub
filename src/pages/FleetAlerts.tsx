import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const FleetAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    const { data } = await supabase.from("fleet_alerts").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false }).limit(50);
    setAlerts(data || []);
  };

  const resolve = async (id: string) => {
    await supabase.from("fleet_alerts").update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq("id", id);
    toast.success("Alert resolved");
    fetchAlerts();
  };

  const severityBadge: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/10 text-warning",
    high: "bg-destructive/10 text-destructive",
    critical: "bg-destructive text-destructive-foreground",
  };

  const unresolved = alerts.filter((a) => !a.is_resolved);
  const resolved = alerts.filter((a) => a.is_resolved);

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Alert Center</h1>
          <p className="text-sm text-muted-foreground">{unresolved.length} unresolved alerts</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><AlertTriangle className="h-5 w-5 text-destructive mb-2" /><p className="text-2xl font-bold font-mono">{unresolved.filter((a) => a.severity === "critical" || a.severity === "high").length}</p><p className="text-xs text-muted-foreground">Critical / High</p></CardContent></Card>
          <Card><CardContent className="p-4"><Bell className="h-5 w-5 text-warning mb-2" /><p className="text-2xl font-bold font-mono">{unresolved.length}</p><p className="text-xs text-muted-foreground">Unresolved</p></CardContent></Card>
          <Card><CardContent className="p-4"><CheckCircle className="h-5 w-5 text-success mb-2" /><p className="text-2xl font-bold font-mono">{resolved.length}</p><p className="text-xs text-muted-foreground">Resolved</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Active Alerts</CardTitle></CardHeader>
          <CardContent>
            {unresolved.length === 0 ? (
              <div className="text-center py-8"><Shield className="h-8 w-8 text-success mx-auto mb-2" /><p className="text-sm text-muted-foreground">All clear</p></div>
            ) : (
              <div className="space-y-3">
                {unresolved.map((a) => (
                  <div key={a.id} className="flex items-start justify-between p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{a.title}</p>
                          <Badge className={severityBadge[a.severity]}>{a.severity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => resolve(a.id)}>Resolve</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FleetLayout>
  );
};

export default FleetAlerts;
