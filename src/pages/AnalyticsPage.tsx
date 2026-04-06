import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FlowMintLayout from "@/components/FlowMintLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Loader2, TrendingUp, DollarSign, ShoppingBag, PiggyBank } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

const DEMO_USER = "00000000-0000-0000-0000-000000000000";

const Analytics = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [posSessions, setPosSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [txRes, expRes, posRes] = await Promise.all([
        supabase.from("wallet_transactions").select("*").eq("user_id", DEMO_USER).order("created_at", { ascending: false }),
        supabase.from("expenses").select("*").eq("user_id", DEMO_USER),
        supabase.from("pos_sessions").select("*").eq("user_id", DEMO_USER),
      ]);
      setTransactions(txRes.data || []);
      setExpenses(expRes.data || []);
      setPosSessions(posRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalIncome = transactions.filter(t => t.transaction_type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalPOS = posSessions.reduce((s, p) => s + Number(p.total), 0);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  transactions.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Expense category breakdown
  const expCategoryMap: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category || "other";
    expCategoryMap[cat] = (expCategoryMap[cat] || 0) + Number(e.amount);
  });
  const expCategoryData = Object.entries(expCategoryMap).map(([name, value]) => ({ name, value }));

  // Daily revenue (last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStr = format(date, "yyyy-MM-dd");
    const dayLabel = format(date, "EEE");
    const dayIncome = transactions
      .filter(t => t.transaction_type === "income" && format(new Date(t.created_at), "yyyy-MM-dd") === dayStr)
      .reduce((s, t) => s + Number(t.amount), 0);
    const dayExpense = expenses
      .filter(e => e.expense_date === dayStr)
      .reduce((s, e) => s + Number(e.amount), 0);
    return { name: dayLabel, income: dayIncome, expense: dayExpense };
  });

  const colors = ["hsl(160, 84%, 44%)", "hsl(250, 65%, 62%)", "hsl(38, 95%, 55%)", "hsl(200, 85%, 60%)", "hsl(0, 72%, 50%)", "hsl(280, 70%, 60%)"];

  const tooltipStyle = {
    background: "hsl(230, 22%, 8%)",
    border: "1px solid hsl(230, 18%, 16%)",
    borderRadius: 12,
    fontSize: 12,
  };

  if (loading) {
    return (
      <FlowMintLayout>
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </FlowMintLayout>
    );
  }

  return (
    <FlowMintLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient-glow">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Automated financial insights — no manual reports needed</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: totalIncome, icon: TrendingUp, gradient: "gradient-mint" },
            { label: "Total Expenses", value: totalExpenses, icon: DollarSign, gradient: "bg-destructive" },
            { label: "POS Sales", value: totalPOS, icon: ShoppingBag, gradient: "gradient-violet" },
            { label: "Net Profit", value: totalIncome - totalExpenses, icon: PiggyBank, gradient: "gradient-mint" },
          ].map(card => (
            <Card key={card.label} className="glass-card border-0">
              <CardContent className="p-5">
                <div className={`h-10 w-10 rounded-xl ${card.gradient} flex items-center justify-center mb-3`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold font-mono text-foreground">KSh {card.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Daily Revenue */}
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4">Daily Revenue vs Expenses (7 days)</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 8%, 52%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220, 8%, 52%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="income" fill="hsl(160, 84%, 44%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill="hsl(0, 72%, 50%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {transactions.length === 0 && <p className="text-center text-xs text-muted-foreground mt-2">Add transactions to see data here</p>}
            </CardContent>
          </Card>

          {/* Income by Category */}
          <Card className="glass-card border-0">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4">Income by Category</h3>
              <div className="h-[250px]">
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {categoryData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {categoryData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="glass-card border-0 lg:col-span-2">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4">Expense Breakdown</h3>
              <div className="h-[250px]">
                {expCategoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No expenses recorded yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expCategoryData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 8%, 52%)" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 8%, 52%)" }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" fill="hsl(250, 65%, 62%)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FlowMintLayout>
  );
};

export default Analytics;
