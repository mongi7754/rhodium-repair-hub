import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PinGate from "@/components/PinGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Shield, User, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Employee = Tables<"employees">;

const AppSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({ full_name: "", business_name: "", phone: "", pin_code: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Employee / PIN management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empDialogOpen, setEmpDialogOpen] = useState(false);
  const [empSaving, setEmpSaving] = useState(false);
  const [empForm, setEmpForm] = useState({ name: "", pin: "", role: "cashier" });

  useEffect(() => {
    if (!user) return;
    // Fetch profile and employees in parallel
    Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("employees").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([profileRes, empRes]) => {
      if (profileRes.data) {
        setProfile({
          full_name: profileRes.data.full_name,
          business_name: profileRes.data.business_name,
          phone: profileRes.data.phone || "",
          pin_code: profileRes.data.pin_code || "",
        });
      }
      setEmployees(empRes.data || []);
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved ✅" });
    }
    setSaving(false);
  };

  const handleAddEmployee = async () => {
    if (!user || !empForm.name || !empForm.pin) return;
    if (empForm.pin.length < 4) {
      toast({ title: "PIN must be at least 4 digits", variant: "destructive" });
      return;
    }
    setEmpSaving(true);
    const { error } = await supabase.from("employees").insert({
      user_id: user.id,
      name: empForm.name,
      pin: empForm.pin,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${empForm.name} added ✅` });
      setEmpForm({ name: "", pin: "", role: "cashier" });
      setEmpDialogOpen(false);
      // Refresh employees
      const { data } = await supabase.from("employees").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setEmployees(data || []);
    }
    setEmpSaving(false);
  };

  const handleToggleEmployee = async (emp: Employee) => {
    const { error } = await supabase.from("employees").update({ is_active: !emp.is_active }).eq("id", emp.id);
    if (!error) {
      setEmployees(employees.map(e => e.id === emp.id ? { ...e, is_active: !e.is_active } : e));
      toast({ title: `${emp.name} ${emp.is_active ? "deactivated" : "activated"}` });
    }
  };

  if (loading) return <PinGate pageName="Settings"><AppLayout><div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppLayout></PinGate>;

  return (
    <PinGate pageName="Settings">
    <AppLayout>
      <div className="space-y-6 max-w-lg">
        <h1 className="text-3xl font-bold">Settings</h1>

        {/* Profile Card */}
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Business Name</Label>
              <Input value={profile.business_name} onChange={(e) => setProfile({ ...profile, business_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="0721..." />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Admin PIN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Administrator PIN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Set a 4-digit PIN for admin access to sensitive actions like editing sales, viewing reports, and managing employees.
            </p>
            <div className="space-y-1">
              <Label>Admin PIN</Label>
              <Input
                type="password"
                maxLength={6}
                value={profile.pin_code}
                onChange={(e) => setProfile({ ...profile, pin_code: e.target.value.replace(/\D/g, "") })}
                placeholder="Enter 4-6 digit PIN"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} variant="outline" className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Admin PIN
            </Button>
          </CardContent>
        </Card>

        {/* Employee / User PINs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" />
                Employee PINs
              </CardTitle>
              <Dialog open={empDialogOpen} onOpenChange={setEmpDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Employee Name *</Label>
                      <Input value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} placeholder="e.g. John" />
                    </div>
                    <div className="space-y-1">
                      <Label>PIN (4+ digits) *</Label>
                      <Input
                        type="password"
                        maxLength={6}
                        value={empForm.pin}
                        onChange={(e) => setEmpForm({ ...empForm, pin: e.target.value.replace(/\D/g, "") })}
                        placeholder="e.g. 1234"
                      />
                    </div>
                    <Button onClick={handleAddEmployee} disabled={empSaving || !empForm.name || empForm.pin.length < 4} className="w-full">
                      {empSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add Employee
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No employees added yet. Add employees so they can log sales with their PIN.</p>
            ) : (
              <div className="space-y-2">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        PIN: ••••  •  {emp.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <Button
                      variant={emp.is_active ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleEmployee(emp)}
                    >
                      {emp.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Account: {user?.email}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
    </PinGate>
  );
};

export default AppSettings;
