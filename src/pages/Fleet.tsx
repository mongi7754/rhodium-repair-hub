import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Plus, Fuel, Gauge } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const Fleet = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plate_number: "",
    make: "",
    model: "",
    year: 2024,
    vehicle_type: "truck",
    fuel_type: "diesel",
    fuel_capacity: 200,
  });

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false });
    setVehicles(data || []);
  };

  const handleAdd = async () => {
    if (!form.plate_number.trim()) { toast.error("Plate number is required"); return; }
    const { error } = await supabase.from("vehicles").insert({ ...form, user_id: DEMO_USER_ID });
    if (error) { toast.error(error.message); return; }
    toast.success("Vehicle added");
    setOpen(false);
    setForm({ plate_number: "", make: "", model: "", year: 2024, vehicle_type: "truck", fuel_type: "diesel", fuel_capacity: 200 });
    fetchVehicles();
  };

  const statusColor: Record<string, string> = {
    available: "bg-success/10 text-success",
    in_transit: "bg-primary/10 text-primary",
    maintenance: "bg-warning/10 text-warning",
    inactive: "bg-muted text-muted-foreground",
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fleet Management</h1>
            <p className="text-sm text-muted-foreground">{vehicles.length} vehicles registered</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Vehicle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Vehicle</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Plate Number *</Label><Input value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} placeholder="KBA 123X" /></div>
                  <div><Label>Type</Label>
                    <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="trailer">Trailer</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Make</Label><Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="Isuzu" /></div>
                  <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="FVZ" /></div>
                  <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Fuel Type</Label>
                    <Select value={form.fuel_type} onValueChange={(v) => setForm({ ...form, fuel_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Fuel Capacity (L)</Label><Input type="number" value={form.fuel_capacity} onChange={(e) => setForm({ ...form, fuel_capacity: Number(e.target.value) })} /></div>
                </div>
                <Button onClick={handleAdd} className="w-full">Add Vehicle</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <Card key={v.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold font-mono text-sm">{v.plate_number}</p>
                      <p className="text-xs text-muted-foreground">{v.make} {v.model} {v.year}</p>
                    </div>
                  </div>
                  <Badge className={statusColor[v.status] || statusColor.inactive}>{v.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-muted/50">
                    <Fuel className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-mono">{v.current_fuel_level}L</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <Gauge className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-mono">{Number(v.odometer).toLocaleString()}km</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">Type</p>
                    <p className="text-xs font-mono">{v.vehicle_type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {vehicles.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No vehicles yet. Add your first vehicle to get started.</p>
            </div>
          )}
        </div>
      </div>
    </FleetLayout>
  );
};

export default Fleet;
