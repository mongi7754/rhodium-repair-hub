import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FlowMintLayout from "@/components/FlowMintLayout";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, ShoppingBag, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DEMO_USER = "00000000-0000-0000-0000-000000000000";

const Dashboard = () => {
  const [stats, setStats] = useState({ income: 0, expenses: 0, profit: 0, savings: 0, txCount: 0 });
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [txRes, expRes] = await Promise.all([
        supabase.from("wallet_transactions").select("*").eq("user_id", DEMO_USER).order("created_at", { ascending: false }).limit(50),
        supabase.from("expenses").select("*").eq("user_id", DEMO_USER),
      ]);

      const transactions = txRes.data || [];
      const expenses = expRes.data || [];

      const income = transactions.filter(t => t.transaction_type === "income").reduce((s, t) => s + Number(t.amount), 0);
      const expenseTotal = expenses.reduce((s, e) => s + Number(e.amount), 0);
      const savings = transactions.filter(t => t.category === "savings").reduce((s, t) => s + Number(t.amount), 0);

      setStats({
        income,
        expenses: expenseTotal,
        profit: income - expenseTotal,
        savings,
        txCount: transactions.length,
      });
      setRecentTx(transactions.slice(0, 8));
      setLoading(false);
    };
    fetchData();
  }, []);

  const summaryCards = [
    { label: "Total Income", value: stats.income, icon: TrendingUp, color: "text-primary", bgClass: "gradient-mint" },
    { label: "Expenses", value: stats.expenses, icon: TrendingDown, color: "text-destructive", bgClass: "bg-destructive" },
    { label: "Net Profit", value: stats.profit, icon: Wallet, color: "text-secondary", bgClass: "gradient-violet" },
    { label: "Savings", value: stats.savings, icon: PiggyBank, color: "text-primary", bgClass: "gradient-mint" },
  ];

  const chartData = [
    { name: "Mon", income: 0, expense: 0 },
    { name: "Tue", income: 0, expense: 0 },
    { name: "Wed", income: 0, expense: 0 },
    { name: "Thu", income: 0, expense: 0 },
    { name: "Fri", income: 0, expense: 0 },
    { name: "Sat", income: 0, expense: 0 },
    { name: "Sun", income: 0, expense: 0 },
  ];

  const pieData = [
    { name: "Expenses", value: stats.expenses || 1, color: "hsl(0, 72%, 50%)" },
    { name: "Savings", value: stats.savings || 1, color: "hsl(160, 84%, 44%)" },
    { name: "Profit", value: Math.max(stats.profit, 0) || 1, color: "hsl(250, 65%, 62%)" },
  ];

  return (
    <FlowMintLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient-glow">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your financial command center — everything at a glance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <Card key={card.label} className="glass-card overflow-hidden border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${card.bgClass} flex items-center justify-center`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  {card.value > 0 ? (
                    <ArrowUpRight className={`h-4 w-4 ${card.color}`} />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color} font-mono`}>
                  KSh {card.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="glass-card border-0 lg:col-span-2">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4">Revenue Trend</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 8%, 52%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220, 8%, 52%)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(230, 22%, 8%)",
                        border: "1px solid hsl(230, 18%, 16%)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="income" stroke="hsl(160, 84%, 44%)" fill="url(#mintGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {stats.txCount === 0 && (
                <p className="text-center text-xs text-muted-foreground mt-2">No data yet — transactions will appear here automatically</p>
              )}
            </CardContent>
          </Card>

          {/* Allocation Pie */}
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4">Money Allocation</h3>
              <div className="h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(230, 22%, 8%)",
                        border: "1px solid hsl(230, 18%, 16%)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="glass-card border-0">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">Recent Transactions</h3>
            {recentTx.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">No transactions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add transactions from the Wallet or POS pages</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTx.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{tx.description || tx.category}</p>
                      <p className="text-xs text-muted-foreground">{tx.payment_method} • {tx.category}</p>
                    </div>
                    <span className={`font-mono font-semibold text-sm ${tx.transaction_type === "income" ? "text-primary" : "text-destructive"}`}>
                      {tx.transaction_type === "income" ? "+" : "-"}KSh {Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FlowMintLayout>
  );
};

export default Dashboard;
