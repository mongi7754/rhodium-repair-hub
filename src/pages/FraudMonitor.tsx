import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Shield, AlertTriangle, Users, Activity, Loader2, Plus,
  CheckCircle2, Clock, Trash2, Eye, RefreshCw, ShieldAlert,
  TrendingUp, UserX, BarChart3,
} from "lucide-react";
import { format } from "date-fns";

type FraudAlert = {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  employee_name: string;
  is_resolved: boolean;
  created_at: string;
};

type ActivityLog = {
  id: string;
  employee_name: string;
  action_type: string;
  entity_type: string;
  details: any;
  created_at: string;
};

type Employee = {
  id: string;
  name: string;
  pin: string;
  is_active: boolean;
  created_at: string;
};

const severityColor: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

const alertTypeIcon: Record<string, typeof AlertTriangle> = {
  void_abuse: Trash2,
  suspicious_edit: Eye,
  unusual_pattern: TrendingUp,
  employee_anomaly: UserX,
};

const FraudMonitor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpPin, setNewEmpPin] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [alertsRes, logsRes, empsRes] = await Promise.all([
      supabase
        .from("fraud_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("employees")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setAlerts((alertsRes.data as FraudAlert[]) || []);
    setLogs((logsRes.data as ActivityLog[]) || []);
    setEmployees((empsRes.data as Employee[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-fraud");
      if (error) throw error;
      toast({
        title: "Analysis Complete",
        description: `Found ${data.count || 0} potential issues.`,
      });
      fetchData();
    } catch (e: any) {
      toast({
        title: "Analysis Failed",
        description: e.message || "Could not run fraud analysis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    await supabase
      .from("fraud_alerts")
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq("id", alertId);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, is_resolved: true } : a))
    );
  };

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("employees").insert({
      user_id: user.id,
      name: newEmpName.trim(),
      pin: newEmpPin,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Employee Added", description: `${newEmpName} can now use PIN entry.` });
    setNewEmpName("");
    setNewEmpPin("");
    setShowAddEmployee(false);
    fetchData();
  };

  const unresolvedCount = alerts.filter((a) => !a.is_resolved).length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.is_resolved).length;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldAlert className="h-8 w-8 text-primary" />
              Fraud Monitor
            </h1>
            <p className="text-muted-foreground">
              AI-powered fraud detection & employee activity tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddEmployee(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Employee
            </Button>
            <Button onClick={runAnalysis} disabled={analyzing}>
              {analyzing ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Run AI Analysis
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unresolvedCount}</p>
                <p className="text-xs text-muted-foreground">Open Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-xs text-muted-foreground">Employees</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-xs text-muted-foreground">Actions Logged</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts" className="gap-1">
              <AlertTriangle className="h-4 w-4" /> Alerts
              {unresolvedCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                  {unresolvedCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1">
              <Activity className="h-4 w-4" /> Activity Log
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-1">
              <Users className="h-4 w-4" /> Employees
            </TabsTrigger>
          </TabsList>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-3">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 mx-auto text-primary/40 mb-4" />
                  <p className="text-lg font-medium">All Clear</p>
                  <p className="text-muted-foreground text-sm">
                    No fraud alerts detected. Run AI Analysis to scan for suspicious activity.
                  </p>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => {
                const Icon = alertTypeIcon[alert.alert_type] || AlertTriangle;
                return (
                  <Card
                    key={alert.id}
                    className={alert.is_resolved ? "opacity-60" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">{alert.title}</p>
                              <Badge
                                variant="outline"
                                className={severityColor[alert.severity] || ""}
                              >
                                {alert.severity}
                              </Badge>
                              {alert.is_resolved && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {alert.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {alert.employee_name && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" /> {alert.employee_name}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(alert.created_at), "MMM d, h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!alert.is_resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-2">
            {logs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground">
                    No activity logged yet. Actions will appear here as employees use the system.
                  </p>
                </CardContent>
              </Card>
            ) : (
              logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs capitalize">
                        {log.action_type.replace(/_/g, " ")}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">
                          <span className="text-primary">{log.employee_name || "System"}</span>
                          {" "}{log.action_type.replace(/_/g, " ")} a {log.entity_type}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(log.created_at), "MMM d, h:mm a")}
                    </span>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-3">
            {employees.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground">
                    No employees added yet. Add employees to start tracking activity.
                  </p>
                  <Button className="mt-4" onClick={() => setShowAddEmployee(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add First Employee
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {employees.map((emp) => (
                  <Card key={emp.id}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Added {format(new Date(emp.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={emp.is_active ? "ml-auto bg-green-500/10 text-green-700 dark:text-green-400" : "ml-auto"}
                      >
                        {emp.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Employee Dialog */}
        <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
          <DialogContent className="sm:max-w-[380px]">
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
              <DialogDescription>
                Create a name/PIN combo for employee identification
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={addEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emp-name-new">Name</Label>
                <Input
                  id="emp-name-new"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="Employee name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-pin-new">PIN (4-6 digits)</Label>
                <Input
                  id="emp-pin-new"
                  value={newEmpPin}
                  onChange={(e) => setNewEmpPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="1234"
                  minLength={4}
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Employee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default FraudMonitor;
