import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FlowMintLayout from "@/components/FlowMintLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Settings, Package, Trash2 } from "lucide-react";

const DEMO_USER = "00000000-0000-0000-0000-000000000000";

const SettingsPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "", selling_price: "", buying_price: "", stock_quantity: "", category: "",
  });

  const fetchData = async () => {
    const res = await supabase.from("products").select("*").eq("user_id", DEMO_USER).order("name");
    setProducts(res.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.selling_price) return;
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      user_id: DEMO_USER,
      name: productForm.name,
      selling_price: Number(productForm.selling_price),
      buying_price: Number(productForm.buying_price) || 0,
      stock_quantity: Number(productForm.stock_quantity) || 0,
      category: productForm.category || "general",
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product added ✅" });
      setProductForm({ name: "", selling_price: "", buying_price: "", stock_quantity: "", category: "" });
      setProductDialogOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product removed" });
    fetchData();
  };

  return (
    <FlowMintLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient-glow">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your products, catalog, and preferences</p>
        </div>

        {/* Product Catalog Management */}
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Product Catalog</h3>
              </div>
              <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-mint text-white border-0">
                    <Plus className="h-3 w-3 mr-1" />Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Product Name *</Label>
                      <Input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Selling Price *</Label>
                        <Input type="number" value={productForm.selling_price} onChange={e => setProductForm({ ...productForm, selling_price: e.target.value })} placeholder="0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Buying Price</Label>
                        <Input type="number" value={productForm.buying_price} onChange={e => setProductForm({ ...productForm, buying_price: e.target.value })} placeholder="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Stock Quantity</Label>
                        <Input type="number" value={productForm.stock_quantity} onChange={e => setProductForm({ ...productForm, stock_quantity: e.target.value })} placeholder="0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Category</Label>
                        <Input value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} placeholder="e.g. electronics" />
                      </div>
                    </div>
                    <Button onClick={handleAddProduct} disabled={saving || !productForm.name || !productForm.selling_price} className="w-full gradient-mint text-white border-0">
                      {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
                <p className="text-sm text-muted-foreground">No products yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add products to use them in Smart POS</p>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Buy: KSh {Number(p.buying_price).toLocaleString()} • Sell: KSh {Number(p.selling_price).toLocaleString()} • Stock: {p.stock_quantity}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">System</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Platform: <span className="text-foreground font-medium">FlowMint v1.0</span></p>
              <p>AI Engine: <span className="text-foreground font-medium">Active</span></p>
              <p>Currency: <span className="text-foreground font-medium">KES (Kenyan Shilling)</span></p>
              <p>Data Mode: <span className="text-foreground font-medium">Cloud Sync</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </FlowMintLayout>
  );
};

export default SettingsPage;
