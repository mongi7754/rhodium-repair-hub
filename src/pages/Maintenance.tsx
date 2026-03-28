import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Plus } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const Maintenance = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ vehicle_id: "", maintenance_type: "routine", description: "", cost: 0, service_provider: "" });

  useEffect(() => {
    fetchRecords();
    supabase.from("vehicles").select("id, plate_number").eq("user_id", DEMO_USER_ID).then(({ data }) => setVehicles(data || []));
  }, []);

  const fetchRecords = async () => {
    const { data } = await supabase.from("maintenance_records").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false });
    setRecords(data || []);
  };

  const handleAdd = async () => {
    if (!form.vehicle_id) { toast.error("Select a vehicle"); return; }
    const { error } = await supabase.from("maintenance_records").insert({ ...form, user_id: DEMO_USER_ID, completed_at: new Date().toISOString() });
    if (error) { toast.error(error.message); return; }
    toast.success("Maintenance record added");
    setOpen(false);
    fetchRecords();
  };

  const totalCost = records.reduce((s, r) => s + Number(r.cost), 0);

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Maintenance</h1>
            <p className="text-sm text-muted-foreground">Total spend: KES {totalCost.toLocaleString()}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Maintenance</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div><Label>Vehicle *</Label>
                  <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_number}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Type</Label>
                  <Select value={form.maintenance_type} onValueChange={(v) => setForm({ ...form, maintenance_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="tire">Tire</SelectItem>
                      <SelectItem value="engine">Engine</SelectItem>
                      <SelectItem value="body">Body Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Cost (KES)</Label><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} /></div>
                  <div><Label>Provider</Label><Input value={form.service_provider} onChange={(e) => setForm({ ...form, service_provider: e.target.value })} /></div>
                </div>
                <Button onClick={handleAdd} className="w-full">Save Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-16"><Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No maintenance records yet.</p></div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => {
              const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
              return (
                <Card key={r.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{vehicle?.plate_number || "—"} • {r.maintenance_type}</p>
                      <p className="text-xs text-muted-foreground">{r.description || "No description"} • {r.service_provider || "—"}</p>
                    </div>
                    <p className="font-bold font-mono text-sm">KES {Number(r.cost).toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </FleetLayout>
  );
};

export default Maintenance;
