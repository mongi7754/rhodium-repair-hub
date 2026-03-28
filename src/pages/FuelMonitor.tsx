import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fuel, Plus, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const FuelMonitor = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ vehicle_id: "", fuel_amount: 0, fuel_cost: 0, odometer_reading: 0, station_name: "", log_type: "refuel" });

  useEffect(() => {
    fetchLogs();
    supabase.from("vehicles").select("id, plate_number").eq("user_id", DEMO_USER_ID).then(({ data }) => setVehicles(data || []));
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase.from("fuel_logs").select("*").eq("user_id", DEMO_USER_ID).order("logged_at", { ascending: false }).limit(50);
    setLogs(data || []);
  };

  const handleAdd = async () => {
    if (!form.vehicle_id || form.fuel_amount <= 0) { toast.error("Vehicle and fuel amount required"); return; }
    const { error } = await supabase.from("fuel_logs").insert({ ...form, user_id: DEMO_USER_ID });
    if (error) { toast.error(error.message); return; }
    toast.success("Fuel log recorded");
    setOpen(false);
    fetchLogs();
  };

  const totalFuel = logs.reduce((s, l) => s + Number(l.fuel_amount), 0);
  const totalCost = logs.reduce((s, l) => s + Number(l.fuel_cost), 0);

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fuel Monitor</h1>
            <p className="text-sm text-muted-foreground">Track fuel consumption and detect anomalies</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Log Fuel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Fuel Entry</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div><Label>Vehicle *</Label>
                  <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_number}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Litres *</Label><Input type="number" value={form.fuel_amount} onChange={(e) => setForm({ ...form, fuel_amount: Number(e.target.value) })} /></div>
                  <div><Label>Cost (KES)</Label><Input type="number" value={form.fuel_cost} onChange={(e) => setForm({ ...form, fuel_cost: Number(e.target.value) })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Odometer</Label><Input type="number" value={form.odometer_reading} onChange={(e) => setForm({ ...form, odometer_reading: Number(e.target.value) })} /></div>
                  <div><Label>Station</Label><Input value={form.station_name} onChange={(e) => setForm({ ...form, station_name: e.target.value })} /></div>
                </div>
                <Button onClick={handleAdd} className="w-full">Save Entry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><Fuel className="h-5 w-5 text-primary mb-2" /><p className="text-2xl font-bold font-mono">{totalFuel.toLocaleString()}L</p><p className="text-xs text-muted-foreground">Total Fuel Used</p></CardContent></Card>
          <Card><CardContent className="p-4"><TrendingDown className="h-5 w-5 text-warning mb-2" /><p className="text-2xl font-bold font-mono">KES {totalCost.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Fuel Cost</p></CardContent></Card>
          <Card><CardContent className="p-4"><AlertTriangle className="h-5 w-5 text-destructive mb-2" /><p className="text-2xl font-bold font-mono">0</p><p className="text-xs text-muted-foreground">Theft Alerts</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Fuel Log History</CardTitle></CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No fuel logs yet.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => {
                  const vehicle = vehicles.find((v) => v.id === log.vehicle_id);
                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{vehicle?.plate_number || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{log.station_name || "—"} • {new Date(log.logged_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono">{Number(log.fuel_amount)}L</p>
                        <p className="text-xs text-muted-foreground">KES {Number(log.fuel_cost).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FleetLayout>
  );
};

export default FuelMonitor;
