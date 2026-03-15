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
import { useToast } from "@/components/ui/use-toast";
import { Plus, Package, AlertTriangle, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const Inventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    buying_price: "",
    selling_price: "",
    stock_quantity: "",
    reorder_level: "5",
    unit: "piece",
  });

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("name");
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleAdd = async () => {
    if (!user || !form.name || !form.selling_price) return;
    setSaving(true);

    const { error } = await supabase.from("products").insert({
      user_id: user.id,
      name: form.name,
      category: form.category,
      buying_price: Number(form.buying_price) || 0,
      selling_price: Number(form.selling_price),
      stock_quantity: Number(form.stock_quantity) || 0,
      reorder_level: Number(form.reorder_level) || 5,
      unit: form.unit,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product added! ✅" });
      setForm({ name: "", category: "", buying_price: "", selling_price: "", stock_quantity: "", reorder_level: "5", unit: "piece" });
      setDialogOpen(false);
      fetchProducts();
    }
    setSaving(false);
  };

  const lowStock = products.filter((p) => p.stock_quantity <= p.reorder_level);

  return (
    <PinGate pageName="Inventory">
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">{products.length} products</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Product Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone Screen" />
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Screens" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Buying Price (KSh)</Label>
                    <Input type="number" value={form.buying_price} onChange={(e) => setForm({ ...form, buying_price: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Selling Price (KSh) *</Label>
                    <Input type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Stock Quantity</Label>
                    <Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Reorder Level</Label>
                    <Input type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleAdd} disabled={saving || !form.name || !form.selling_price} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <Card className="border-secondary">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium text-secondary">Low Stock Alert!</p>
                <p className="text-sm text-muted-foreground">
                  {lowStock.map((p) => p.name).join(", ")} — reorder soon
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products yet. Add your first product!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {products.map((product) => {
              const isLow = product.stock_quantity <= product.reorder_level;
              const margin = product.selling_price > 0 && product.buying_price > 0
                ? ((product.selling_price - product.buying_price) / product.selling_price * 100).toFixed(0)
                : null;

              return (
                <Card key={product.id} className={isLow ? "border-secondary/50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{product.name}</p>
                          {product.category && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Buy: KSh {Number(product.buying_price).toLocaleString()} → Sell: KSh {Number(product.selling_price).toLocaleString()}
                          {margin && <span className="text-primary ml-2">({margin}% margin)</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isLow ? "text-secondary" : ""}`}>
                          {product.stock_quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.unit}s in stock</p>
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

export default Inventory;
