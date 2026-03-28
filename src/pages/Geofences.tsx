import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, MapPin } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const Geofences = () => {
  const [fences, setFences] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", center_lat: -1.29, center_lng: 36.82, radius_meters: 500, fence_type: "allowed" });

  useEffect(() => { fetchFences(); }, []);

  const fetchFences = async () => {
    const { data } = await supabase.from("geofences").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false });
    setFences(data || []);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    const { error } = await supabase.from("geofences").insert({ ...form, user_id: DEMO_USER_ID });
    if (error) { toast.error(error.message); return; }
    toast.success("Geofence created");
    setOpen(false);
    fetchFences();
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Geofences</h1>
            <p className="text-sm text-muted-foreground">{fences.length} zones configured</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Zone</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Geofence Zone</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div><Label>Zone Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nairobi Depot" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Latitude</Label><Input type="number" step="0.0001" value={form.center_lat} onChange={(e) => setForm({ ...form, center_lat: Number(e.target.value) })} /></div>
                  <div><Label>Longitude</Label><Input type="number" step="0.0001" value={form.center_lng} onChange={(e) => setForm({ ...form, center_lng: Number(e.target.value) })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Radius (m)</Label><Input type="number" value={form.radius_meters} onChange={(e) => setForm({ ...form, radius_meters: Number(e.target.value) })} /></div>
                  <div><Label>Type</Label>
                    <Select value={form.fence_type} onValueChange={(v) => setForm({ ...form, fence_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allowed">Allowed Zone</SelectItem>
                        <SelectItem value="restricted">Restricted Zone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full">Create Zone</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {fences.length === 0 ? (
          <div className="text-center py-16"><Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No geofences configured yet.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fences.map((f) => (
              <Card key={f.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-medium text-sm">{f.name}</p>
                    </div>
                    <Badge className={f.fence_type === "allowed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                      {f.fence_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {Number(f.center_lat).toFixed(4)}, {Number(f.center_lng).toFixed(4)} • {Number(f.radius_meters)}m
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FleetLayout>
  );
};

export default Geofences;
