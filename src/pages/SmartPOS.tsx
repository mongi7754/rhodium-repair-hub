import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FlowMintLayout from "@/components/FlowMintLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, ShoppingBag, Trash2, Receipt, CreditCard, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const DEMO_USER = "00000000-0000-0000-0000-000000000000";

interface CartItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  product_id?: string;
}

const SmartPOS = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");

  const [newItem, setNewItem] = useState({ product_name: "", quantity: "1", unit_price: "" });

  const fetchData = async () => {
    const [prodRes, sessRes] = await Promise.all([
      supabase.from("products").select("*").eq("user_id", DEMO_USER).order("name"),
      supabase.from("pos_sessions").select("*").eq("user_id", DEMO_USER).order("created_at", { ascending: false }).limit(20),
    ]);
    setProducts(prodRes.data || []);
    setSessions(sessRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addToCart = (product?: any) => {
    if (product) {
      const existing = cart.findIndex(c => c.product_id === product.id);
      if (existing >= 0) {
        setCart(cart.map((c, i) => i === existing ? { ...c, quantity: c.quantity + 1 } : c));
      } else {
        setCart([...cart, { product_name: product.name, quantity: 1, unit_price: Number(product.selling_price), product_id: product.id }]);
      }
    } else if (newItem.product_name && newItem.unit_price) {
      setCart([...cart, { product_name: newItem.product_name, quantity: Number(newItem.quantity) || 1, unit_price: Number(newItem.unit_price) }]);
      setNewItem({ product_name: "", quantity: "1", unit_price: "" });
      setAddProductOpen(false);
    }
  };

  const removeFromCart = (index: number) => setCart(cart.filter((_, i) => i !== index));

  const subtotal = cart.reduce((s, item) => s + item.quantity * item.unit_price, 0);
  const receiptNumber = `FM-${Date.now().toString(36).toUpperCase()}`;

  const completeSale = async () => {
    if (cart.length === 0) return;
    setSaving(true);

    const { error } = await supabase.from("pos_sessions").insert({
      user_id: DEMO_USER,
      items: cart as any,
      subtotal,
      total: subtotal,
      payment_method: paymentMethod,
      payment_status: "completed",
      receipt_number: receiptNumber,
      customer_name: customerName,
    });

    if (!error) {
      // Also log as wallet transaction
      await supabase.from("wallet_transactions").insert({
        user_id: DEMO_USER,
        amount: subtotal,
        transaction_type: "income",
        category: "sales",
        description: `POS Sale: ${cart.map(c => c.product_name).join(", ")}`,
        payment_method: paymentMethod,
        reference: receiptNumber,
        is_auto_detected: true,
      });

      toast({ title: "Sale completed ✅", description: `Receipt: ${receiptNumber}` });
      setCart([]);
      setCustomerName("");
      fetchData();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <FlowMintLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient-glow">Smart POS</h1>
          <p className="text-muted-foreground text-sm mt-1">Point of sale — add products, complete sales instantly</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Product Catalog */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Product Catalog</h3>
              <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Plus className="h-3 w-3 mr-1" />Custom Item</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Custom Item</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Product Name *</Label>
                      <Input value={newItem.product_name} onChange={e => setNewItem({ ...newItem, product_name: e.target.value })} placeholder="Item name" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Quantity</Label>
                        <Input type="number" min="1" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Price (KSh) *</Label>
                        <Input type="number" value={newItem.unit_price} onChange={e => setNewItem({ ...newItem, unit_price: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={() => addToCart()} disabled={!newItem.product_name || !newItem.unit_price} className="w-full gradient-mint text-white border-0">
                      Add to Cart
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {products.length === 0 ? (
              <Card className="glass-card border-0">
                <CardContent className="p-8 text-center">
                  <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
                  <p className="text-sm text-muted-foreground">No products in catalog</p>
                  <p className="text-xs text-muted-foreground mt-1">Use "Custom Item" to add items to cart, or add products in Settings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((p) => (
                  <Card key={p.id} className="glass-card border-0 cursor-pointer hover:glow-mint transition-all" onClick={() => addToCart(p)}>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-lg font-bold font-mono text-primary mt-1">KSh {Number(p.selling_price).toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Stock: {p.stock_quantity}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recent Sessions */}
            <h3 className="text-sm font-semibold mt-6">Recent Sales</h3>
            {sessions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No sales yet</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => (
                  <Card key={s.id} className="glass-card border-0">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{s.receipt_number}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(s.created_at), "MMM d, h:mm a")} • {s.payment_method}</p>
                      </div>
                      <p className="font-mono font-bold text-primary">KSh {Number(s.total).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-0 sticky top-6">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Current Cart</h3>
                  <Badge variant="outline" className="ml-auto text-[10px]">{cart.length} items</Badge>
                </div>

                {cart.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">Tap a product or add a custom item</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {cart.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} × KSh {item.unit_price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">KSh {(item.quantity * item.unit_price).toLocaleString()}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(i)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-mono text-primary">KSh {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Customer (optional)</Label>
                    <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Walk-in" />
                  </div>

                  <Button onClick={completeSale} disabled={saving || cart.length === 0} className="w-full gradient-mint text-white border-0 shadow-lg h-12 text-base">
                    {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                    Complete Sale
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FlowMintLayout>
  );
};

export default SmartPOS;
