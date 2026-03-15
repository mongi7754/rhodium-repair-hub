import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PinGate from "@/components/PinGate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Loader2, Receipt } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Expense = Tables<"expenses">;

const EXPENSE_CATEGORIES = [
  { value: "electricity", label: "Electricity" },
  { value: "fare", label: "Fare / Transport" },
  { value: "salaries", label: "Salaries" },
  { value: "rent", label: "Rent" },
  { value: "stock", label: "Stock Purchase" },
  { value: "internet", label: "Internet / WiFi" },
  { value: "water", label: "Water" },
  { value: "others", label: "Others" },
];

const Expenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "others" });

  const fetchExpenses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setExpenses(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.description || !form.amount) return;
    setSaving(true);
    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Expense added ✅" });
      setForm({ description: "", amount: "", category: "others" });
      setDialogOpen(false);
      fetchExpenses();
    }
    setSaving(false);
  };

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  // Group by category for summary
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || "others";
    acc[cat] = (acc[cat] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <PinGate pageName="Expenses">
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Total: KSh {total.toLocaleString()}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Description *</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Monthly electricity bill" />
                </div>
                <div className="space-y-1">
                  <Label>Amount (KSh) *</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} disabled={saving || !form.description || !form.amount} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Summary */}
        {Object.keys(categoryTotals).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
              const label = EXPENSE_CATEGORIES.find(c => c.value === cat)?.label || cat;
              return (
                <Card key={cat}>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground capitalize">{label}</p>
                    <p className="font-bold text-destructive">KSh {amount.toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : expenses.length === 0 ? (
          <Card><CardContent className="p-8 text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No expenses recorded yet.</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-2">
            {expenses.map((exp) => {
              const label = EXPENSE_CATEGORIES.find(c => c.value === exp.category)?.label || exp.category || "Others";
              return (
                <Card key={exp.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exp.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(exp.created_at), "MMM d, h:mm a")} • {label}
                      </p>
                    </div>
                    <span className="font-bold text-destructive">-KSh {Number(exp.amount).toLocaleString()}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
    </PinGate>
  );
};

export default Expenses;
