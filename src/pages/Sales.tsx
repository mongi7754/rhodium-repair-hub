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
import { Loader2, ShoppingCart, Mic, Plus } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Sale = Tables<"sales">;

const Sales = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    quantity: "1",
    unit_price: "",
    payment_method: "cash",
  });

  const fetchSales = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setSales(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, [user]);

  const handleAdd = async () => {
    if (!user || !form.product_name || !form.unit_price) return;
    setSaving(true);
    const quantity = Number(form.quantity) || 1;
    const unitPrice = Number(form.unit_price);
    const totalAmount = quantity * unitPrice;

    const { error } = await supabase.from("sales").insert({
      user_id: user.id,
      product_name: form.product_name,
      quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      payment_method: form.payment_method,
      logged_via: "manual",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sale added ✅" });
      setForm({ product_name: "", quantity: "1", unit_price: "", payment_method: "cash" });
      setDialogOpen(false);
      fetchSales();
    }
    setSaving(false);
  };

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales History</h1>
            <p className="text-muted-foreground">
              Total: KSh {totalRevenue.toLocaleString()} from {sales.length} sales
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Sale</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Sale</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Product Name *</Label>
                  <Input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="e.g. iPhone Screen" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Quantity</Label>
                    <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Unit Price (KSh) *</Label>
                    <Input type="number" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} />
                  </div>
                </div>
                {form.quantity && form.unit_price && (
                  <p className="text-sm font-medium text-primary">
                    Total: KSh {(Number(form.quantity) * Number(form.unit_price)).toLocaleString()}
                  </p>
                )}
                <div className="space-y-1">
                  <Label>Payment Method</Label>
                  <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} disabled={saving || !form.product_name || !form.unit_price} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Sale
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sales.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sales yet. Click "Add Sale" to record your first sale!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sales.map((sale) => (
              <Card key={sale.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{sale.product_name}</p>
                        {sale.logged_via === "voice" && (
                          <Mic className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(sale.created_at), "MMM d, h:mm a")} •{" "}
                        {sale.quantity} × KSh {Number(sale.unit_price).toLocaleString()} •{" "}
                        {sale.payment_method}
                      </p>
                    </div>
                    <span className="font-bold text-primary">
                      KSh {Number(sale.total_amount).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Sales;
