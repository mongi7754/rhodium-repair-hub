import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Shield, Star, Route } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const Drivers = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", license_number: "", pin: "" });

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    const { data } = await supabase.from("fleet_drivers").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false });
    setDrivers(data || []);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.pin.trim()) { toast.error("Name and PIN are required"); return; }
    const { error } = await supabase.from("fleet_drivers").insert({ ...form, user_id: DEMO_USER_ID });
    if (error) { toast.error(error.message); return; }
    toast.success("Driver added");
    setOpen(false);
    setForm({ name: "", phone: "", email: "", license_number: "", pin: "" });
    fetchDrivers();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Driver Management</h1>
            <p className="text-sm text-muted-foreground">{drivers.length} registered drivers</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Driver</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register New Driver</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254..." /></div>
                  <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>License No.</Label><Input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} /></div>
                  <div><Label>PIN *</Label><Input value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} maxLength={6} placeholder="4-6 digits" /></div>
                </div>
                <Button onClick={handleAdd} className="w-full">Register Driver</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <Card key={d.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.phone || "No phone"}</p>
                    </div>
                  </div>
                  <Badge className={d.status === "available" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                    {d.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-muted/50">
                    <Star className={`h-3 w-3 mx-auto mb-1 ${getScoreColor(Number(d.safety_score))}`} />
                    <p className="text-xs font-mono">{Number(d.safety_score).toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground">Score</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <Route className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-mono">{d.total_trips}</p>
                    <p className="text-[10px] text-muted-foreground">Trips</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <Shield className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-mono">{Number(d.total_distance).toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">KM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {drivers.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No drivers registered. Add your first driver.</p>
            </div>
          )}
        </div>
      </div>
    </FleetLayout>
  );
};

export default Drivers;
