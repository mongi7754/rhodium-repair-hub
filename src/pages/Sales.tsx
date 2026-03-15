import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PinGate from "@/components/PinGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShoppingCart, Mic, Plus, TrendingUp, Users, RotateCcw, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

type Sale = Tables<"sales">;

const Sales = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; selling_price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [form, setForm] = useState({
    product_name: "",
    quantity: "1",
    unit_price: "",
    payment_method: "cash",
    customer_name: "",
    discount_amount: "0",
    notes: "",
  });

  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [returnForm, setReturnForm] = useState({
    reason: "",
    refund_amount: "",
  });

  const fetchAll = async () => {
    if (!user) return;
    const [salesRes, custRes, prodRes] = await Promise.all([
      supabase.from("sales").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
      supabase.from("customers").select("id, name").eq("user_id", user.id).order("name"),
      supabase.from("products").select("id, name, selling_price").eq("user_id", user.id).order("name"),
    ]);
    setSales(salesRes.data || []);
    setCustomers(custRes.data || []);
    setProducts(prodRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [user]);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setForm(f => ({ ...f, product_name: product.name, unit_price: String(product.selling_price) }));
    }
  };

  const handleAdd = async () => {
    if (!user || !form.product_name || !form.unit_price) return;
    setSaving(true);
    const quantity = Number(form.quantity) || 1;
    const unitPrice = Number(form.unit_price);
    const discount = Number(form.discount_amount) || 0;
    const totalAmount = (quantity * unitPrice) - discount;

    const { error } = await supabase.from("sales").insert({
      user_id: user.id,
      product_name: form.product_name,
      quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      payment_method: form.payment_method,
      customer_name: form.customer_name,
      discount_amount: discount,
      notes: form.notes,
      logged_via: "manual",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sale added ✅" });
      setForm({ product_name: "", quantity: "1", unit_price: "", payment_method: "cash", customer_name: "", discount_amount: "0", notes: "" });
      setDialogOpen(false);
      fetchAll();
    }
    setSaving(false);
  };

  const handleAddCustomer = async () => {
    if (!user || !customerForm.name) return;
    setSaving(true);
    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      name: customerForm.name,
      phone: customerForm.phone,
      email: customerForm.email,
      address: customerForm.address,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Customer added ✅" });
      setCustomerForm({ name: "", phone: "", email: "", address: "" });
      setCustomerDialogOpen(false);
      fetchAll();
    }
    setSaving(false);
  };

  const handleReturn = async () => {
    if (!user || !selectedSale) return;
    setSaving(true);
    const refund = Number(returnForm.refund_amount) || Number(selectedSale.total_amount);

    const { error } = await supabase.from("returns").insert({
      user_id: user.id,
      sale_id: selectedSale.id,
      product_name: selectedSale.product_name,
      quantity: selectedSale.quantity,
      refund_amount: refund,
      reason: returnForm.reason,
      status: "completed",
    });

    if (!error) {
      await supabase.from("sales").update({ status: "returned" }).eq("id", selectedSale.id);
      toast({ title: "Return processed ✅" });
      setReturnDialogOpen(false);
      setSelectedSale(null);
      setReturnForm({ reason: "", refund_amount: "" });
      fetchAll();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (saleId: string) => {
    const { error } = await supabase.from("sales").delete().eq("id", saleId);
    if (!error) {
      toast({ title: "Sale deleted" });
      fetchAll();
    }
  };

  const totalRevenue = sales.filter(s => (s as any).status !== "returned").reduce((sum, s) => sum + Number(s.total_amount), 0);
  const todaySales = sales.filter(s => format(new Date(s.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"));
  const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  return (
    <PinGate pageName="Sales">
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold">Sales</h1>
              <p className="text-muted-foreground">{sales.length} total records</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline"><Users className="h-4 w-4 mr-2" />Add Customer</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Customer Name *</Label>
                      <Input value={customerForm.name} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone</Label>
                      <Input value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} placeholder="0712345678" />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })} placeholder="john@email.com" />
                    </div>
                    <div className="space-y-1">
                      <Label>Address</Label>
                      <Input value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} />
                    </div>
                    <Button onClick={handleAddCustomer} disabled={saving || !customerForm.name} className="w-full">
                      {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" />Add Sale</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Add New Sale</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    {/* Product from inventory */}
                    {products.length > 0 && (
                      <div className="space-y-1">
                        <Label>Select from Inventory</Label>
                        <Select onValueChange={handleProductSelect}>
                          <SelectTrigger><SelectValue placeholder="Pick a product..." /></SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name} — KSh {Number(p.selling_price).toLocaleString()}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label>Product Name *</Label>
                      <Input value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} placeholder="e.g. iPhone Screen" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Quantity</Label>
                        <Input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label>Unit Price (KSh) *</Label>
                        <Input type="number" value={form.unit_price} onChange={e => setForm({ ...form, unit_price: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Discount (KSh)</Label>
                        <Input type="number" value={form.discount_amount} onChange={e => setForm({ ...form, discount_amount: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label>Payment Method</Label>
                        <Select value={form.payment_method} onValueChange={v => setForm({ ...form, payment_method: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="credit">Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* Customer */}
                    <div className="space-y-1">
                      <Label>Customer</Label>
                      {customers.length > 0 ? (
                        <Select value={form.customer_name} onValueChange={v => setForm({ ...form, customer_name: v })}>
                          <SelectTrigger><SelectValue placeholder="Select customer (optional)" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value=" ">Walk-in Customer</SelectItem>
                            {customers.map(c => (
                              <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="Walk-in customer" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Notes</Label>
                      <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
                    </div>
                    {form.quantity && form.unit_price && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">Subtotal: KSh {(Number(form.quantity) * Number(form.unit_price)).toLocaleString()}</p>
                        {Number(form.discount_amount) > 0 && (
                          <p className="text-sm text-destructive">Discount: -KSh {Number(form.discount_amount).toLocaleString()}</p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          Total: KSh {((Number(form.quantity) * Number(form.unit_price)) - (Number(form.discount_amount) || 0)).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <Button onClick={handleAdd} disabled={saving || !form.product_name || !form.unit_price} className="w-full">
                      {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add Sale
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-primary">KSh {totalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Today's Sales</p>
                <p className="text-xl font-bold">{todaySales.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <p className="text-xl font-bold text-primary">KSh {todayRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="text-xl font-bold">{customers.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Return Dialog */}
          <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Process Return</DialogTitle></DialogHeader>
              {selectedSale && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Returning: <strong>{selectedSale.product_name}</strong> — KSh {Number(selectedSale.total_amount).toLocaleString()}
                  </p>
                  <div className="space-y-1">
                    <Label>Reason</Label>
                    <Input value={returnForm.reason} onChange={e => setReturnForm({ ...returnForm, reason: e.target.value })} placeholder="Reason for return" />
                  </div>
                  <div className="space-y-1">
                    <Label>Refund Amount (KSh)</Label>
                    <Input type="number" value={returnForm.refund_amount} onChange={e => setReturnForm({ ...returnForm, refund_amount: e.target.value })} placeholder={String(selectedSale.total_amount)} />
                  </div>
                  <Button onClick={handleReturn} disabled={saving} className="w-full" variant="destructive">
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Process Return
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Sales List */}
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
              {sales.map((sale) => {
                const status = (sale as any).status || "completed";
                const isReturned = status === "returned";
                return (
                  <Card key={sale.id} className={isReturned ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{sale.product_name}</p>
                            {sale.logged_via === "voice" && <Mic className="h-3 w-3 text-primary" />}
                            {isReturned && <Badge variant="destructive" className="text-xs">Returned</Badge>}
                            {(sale as any).customer_name && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{(sale as any).customer_name}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(sale.created_at), "MMM d, h:mm a")} • {sale.quantity} × KSh {Number(sale.unit_price).toLocaleString()} • {sale.payment_method}
                            {Number((sale as any).discount_amount) > 0 && ` • -KSh ${Number((sale as any).discount_amount).toLocaleString()} disc.`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary whitespace-nowrap">
                            KSh {Number(sale.total_amount).toLocaleString()}
                          </span>
                          {!isReturned && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedSale(sale); setReturnForm({ reason: "", refund_amount: "" }); setReturnDialogOpen(true); }}>
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(sale.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
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

export default Sales;
