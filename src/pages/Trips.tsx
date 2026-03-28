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
import { Route, Plus, QrCode, Play, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const generateTripCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "TRP-";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

const Trips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    vehicle_id: "",
    driver_id: "",
    origin_name: "",
    destination_name: "",
    cargo_type: "",
    cargo_weight: 0,
  });

  useEffect(() => {
    fetchTrips();
    fetchVehiclesAndDrivers();
  }, []);

  const fetchTrips = async () => {
    const { data } = await supabase.from("trips").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false });
    setTrips(data || []);
  };

  const fetchVehiclesAndDrivers = async () => {
    const [v, d] = await Promise.all([
      supabase.from("vehicles").select("id, plate_number").eq("user_id", DEMO_USER_ID),
      supabase.from("fleet_drivers").select("id, name").eq("user_id", DEMO_USER_ID),
    ]);
    setVehicles(v.data || []);
    setDrivers(d.data || []);
  };

  const handleCreate = async () => {
    if (!form.origin_name.trim() || !form.destination_name.trim()) {
      toast.error("Origin and destination are required");
      return;
    }
    const tripCode = generateTripCode();
    const { error } = await supabase.from("trips").insert({
      user_id: DEMO_USER_ID,
      trip_code: tripCode,
      qr_code_data: JSON.stringify({ tripCode, ts: Date.now() }),
      vehicle_id: form.vehicle_id || null,
      driver_id: form.driver_id || null,
      origin_name: form.origin_name,
      destination_name: form.destination_name,
      cargo_type: form.cargo_type,
      cargo_weight: form.cargo_weight,
      status: "assigned",
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Trip ${tripCode} created`);
    setOpen(false);
    setForm({ vehicle_id: "", driver_id: "", origin_name: "", destination_name: "", cargo_type: "", cargo_weight: 0 });
    fetchTrips();
  };

  const startTrip = async (id: string) => {
    await supabase.from("trips").update({ status: "in_progress", start_time: new Date().toISOString() }).eq("id", id);
    toast.success("Trip started");
    fetchTrips();
  };

  const completeTrip = async (id: string) => {
    await supabase.from("trips").update({ status: "completed", end_time: new Date().toISOString() }).eq("id", id);
    toast.success("Trip completed");
    fetchTrips();
  };

  const statusBadge: Record<string, string> = {
    assigned: "bg-muted text-muted-foreground",
    in_progress: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trip Management</h1>
            <p className="text-sm text-muted-foreground">{trips.length} total trips</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Trip</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Trip</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Origin *</Label><Input value={form.origin_name} onChange={(e) => setForm({ ...form, origin_name: e.target.value })} placeholder="Nairobi" /></div>
                  <div><Label>Destination *</Label><Input value={form.destination_name} onChange={(e) => setForm({ ...form, destination_name: e.target.value })} placeholder="Mombasa" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Vehicle</Label>
                    <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                      <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_number}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Driver</Label>
                    <Select value={form.driver_id} onValueChange={(v) => setForm({ ...form, driver_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                      <SelectContent>{drivers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Cargo Type</Label><Input value={form.cargo_type} onChange={(e) => setForm({ ...form, cargo_type: e.target.value })} placeholder="Cement" /></div>
                  <div><Label>Weight (tons)</Label><Input type="number" value={form.cargo_weight} onChange={(e) => setForm({ ...form, cargo_weight: Number(e.target.value) })} /></div>
                </div>
                <Button onClick={handleCreate} className="w-full">Create Trip</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold font-mono text-sm">{trip.trip_code}</p>
                      <Badge className={statusBadge[trip.status] || ""}>{trip.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {trip.origin_name} → {trip.destination_name}
                      {trip.cargo_type ? ` • ${trip.cargo_type}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {trip.status === "assigned" && (
                    <Button size="sm" onClick={() => startTrip(trip.id)}>
                      <Play className="h-3 w-3 mr-1" /> Start
                    </Button>
                  )}
                  {trip.status === "in_progress" && (
                    <Button size="sm" variant="secondary" onClick={() => completeTrip(trip.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {trips.length === 0 && (
            <div className="text-center py-16">
              <Route className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No trips yet. Create your first trip to get started.</p>
            </div>
          )}
        </div>
      </div>
    </FleetLayout>
  );
};

export default Trips;
