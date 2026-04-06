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
import { Loader2, Plus, ArrowUpRight, ArrowDownRight, Wallet, Send, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const DEMO_USER = "00000000-0000-0000-0000-000000000000";

const WalletPage = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    amount: "",
    transaction_type: "income",
    category: "sales",
    description: "",
    payment_method: "mpesa",
    reference: "",
  });

  const fetchData = async () => {
    const [txRes, accRes] = await Promise.all([
      supabase.from("wallet_transactions").select("*").eq("user_id", DEMO_USER).order("created_at", { ascending: false }).limit(100),
      supabase.from("wallet_accounts").select("*").eq("user_id", DEMO_USER),
    ]);
    setTransactions(txRes.data || []);
    setAccounts(accRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: DEMO_USER,
      amount: Number(form.amount),
      transaction_type: form.transaction_type,
      category: form.category,
      description: form.description,
      payment_method: form.payment_method,
      reference: form.reference,
      is_auto_detected: false,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Transaction added ✅" });
      setForm({ amount: "", transaction_type: "income", category: "sales", description: "", payment_method: "mpesa", reference: "" });
      setDialogOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const totalIncome = transactions.filter(t => t.transaction_type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.transaction_type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const filteredTx = filter === "all" ? transactions : transactions.filter(t => t.transaction_type === filter);

  const categories = ["sales", "services", "refund", "salary", "rent", "utilities", "supplies", "transport", "food", "savings", "other"];

  return (
    <FlowMintLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gradient-glow">Wallet</h1>
            <p className="text-muted-foreground text-sm mt-1">Smart financial hub — AI auto-categorized</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-mint text-white border-0 shadow-lg glow-mint">
                <Plus className="h-4 w-4 mr-2" />Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={form.transaction_type} onValueChange={v => setForm({ ...form, transaction_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Amount (KSh) *</Label>
                    <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Payment Method</Label>
                    <Select value={form.payment_method} onValueChange={v => setForm({ ...form, payment_method: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Transaction description" />
                </div>
                <div className="space-y-1.5">
                  <Label>Reference</Label>
                  <Input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="e.g. M-Pesa code" />
                </div>
                {form.amount && (
                  <div className="p-4 rounded-xl bg-muted">
                    <p className={`text-2xl font-bold font-mono ${form.transaction_type === "income" ? "text-primary" : "text-destructive"}`}>
                      {form.transaction_type === "income" ? "+" : "-"}KSh {Number(form.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{form.category} • {form.payment_method}</p>
                  </div>
                )}
                <Button onClick={handleAdd} disabled={saving || !form.amount} className="w-full gradient-mint text-white border-0">
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card border-0 glow-mint">
            <CardContent className="p-5 text-center">
              <Wallet className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold font-mono text-primary">KSh {balance.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-5 text-center">
              <ArrowUpRight className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-xl font-bold font-mono">KSh {totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-5 text-center">
              <ArrowDownRight className="h-6 w-6 mx-auto text-destructive mb-2" />
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-xl font-bold font-mono">KSh {totalExpense.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["all", "income", "expense", "transfer"].map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}
              className={filter === f ? "gradient-mint text-white border-0" : ""}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Transaction List */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filteredTx.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="p-10 text-center">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first transaction to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredTx.map((tx) => (
              <Card key={tx.id} className="glass-card border-0 hover:glow-mint transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tx.transaction_type === "income" ? "gradient-mint" : tx.transaction_type === "expense" ? "bg-destructive" : "gradient-violet"}`}>
                        {tx.transaction_type === "income" ? <ArrowUpRight className="h-4 w-4 text-white" /> : <ArrowDownRight className="h-4 w-4 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description || tx.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.created_at), "MMM d, h:mm a")} • {tx.payment_method}
                          {tx.is_auto_detected && " • AI detected"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold ${tx.transaction_type === "income" ? "text-primary" : "text-destructive"}`}>
                        {tx.transaction_type === "income" ? "+" : "-"}KSh {Number(tx.amount).toLocaleString()}
                      </p>
                      <Badge variant="outline" className="text-[10px] mt-1">{tx.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FlowMintLayout>
  );
};

export default WalletPage;
