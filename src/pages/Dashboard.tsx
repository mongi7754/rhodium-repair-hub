import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, AlertTriangle, Target, Brain, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface DashboardData {
  todayRevenue: number;
  todayExpenses: number;
  todayProfit: number;
  totalProducts: number;
  totalSalesToday: number;
  lowStockCount: number;
  recentSales: Array<{ product_name: string; total_amount: number; created_at: string }>;
  weeklyTrend: Array<{ day: string; revenue: number }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    todayRevenue: 0, todayExpenses: 0, todayProfit: 0, totalProducts: 0,
    totalSalesToday: 0, lowStockCount: 0, recentSales: [], weeklyTrend: [],
  });
  const [healthScore, setHealthScore] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [goalTarget, setGoalTarget] = useState(50000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    if (!user) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");

    const fetchData = async () => {
      const [salesRes, expensesRes, productsRes, monthlySalesRes, weekSalesRes] = await Promise.all([
        supabase.from("sales").select("*").eq("user_id", user.id).eq("sale_date", today),
        supabase.from("expenses").select("*").eq("user_id", user.id).eq("expense_date", today),
        supabase.from("products").select("*").eq("user_id", user.id),
        supabase.from("sales").select("total_amount").eq("user_id", user.id).gte("sale_date", monthStart),
        supabase.from("sales").select("sale_date, total_amount").eq("user_id", user.id).gte("sale_date", format(new Date(Date.now() - 7 * 86400000), "yyyy-MM-dd")),
      ]);

      const sales = salesRes.data || [];
      const expenses = expensesRes.data || [];
      const products = productsRes.data || [];
      const monthlySales = monthlySalesRes.data || [];
      const weekSales = weekSalesRes.data || [];

      const todayRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
      const todayExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const lowStock = products.filter(p => p.stock_quantity <= p.reorder_level);
      const profit = todayRevenue - todayExpenses;
      const margin = todayRevenue > 0 ? (profit / todayRevenue) * 100 : 0;
      const score = Math.min(100, Math.max(0, Math.round(50 + margin * 0.5 + (products.length > 0 ? 10 : 0) - lowStock.length * 5)));
      const monthRev = monthlySales.reduce((s, r) => s + Number(r.total_amount), 0);

      // Weekly trend
      const trendMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = format(new Date(Date.now() - i * 86400000), "yyyy-MM-dd");
        trendMap[d] = 0;
      }
      weekSales.forEach(s => { if (trendMap[s.sale_date] !== undefined) trendMap[s.sale_date] += Number(s.total_amount); });
      const weeklyTrend = Object.entries(trendMap).map(([d, revenue]) => ({ day: format(new Date(d), "EEE"), revenue }));

      // AI insights
      const aiInsights: string[] = [];
      if (todayExpenses > todayRevenue && todayRevenue > 0) aiInsights.push("⚠️ Today's expenses exceed revenue. Review spending.");
      if (lowStock.length > 0) aiInsights.push(`📦 ${lowStock.length} product(s) running low on stock. Reorder soon.`);
      if (score < 40) aiInsights.push("🔴 Business health is critical. Focus on increasing sales or reducing costs.");
      if (monthRev > goalTarget * 0.8) aiInsights.push("🎯 You're close to your monthly goal! Keep pushing.");
      if (sales.length === 0) aiInsights.push("💡 No sales today yet. Use Voice Log to record transactions quickly.");
      if (profit > 0 && margin > 30) aiInsights.push("🟢 Great margins today! Your pricing strategy is working.");

      setHealthScore(score);
      setMonthlyRevenue(monthRev);
      setInsights(aiInsights);
      setData({
        todayRevenue, todayExpenses, todayProfit: profit, totalProducts: products.length,
        totalSalesToday: sales.length, lowStockCount: lowStock.length,
        recentSales: sales.slice(-5).reverse(), weeklyTrend,
      });
    };

    fetchData();
  }, [user]);

  const healthColor = healthScore >= 70 ? "text-accent" : healthScore >= 40 ? "text-warning" : "text-destructive";
  const healthLabel = healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Moderate" : "At Risk";
  const healthEmoji = healthScore >= 70 ? "🟢" : healthScore >= 40 ? "🟡" : "🔴";

  const stats = [
    { label: "Today's Revenue", value: `KSh ${data.todayRevenue.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Today's Expenses", value: `KSh ${data.todayExpenses.toLocaleString()}`, icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Net Profit", value: `KSh ${data.todayProfit.toLocaleString()}`, icon: TrendingUp, color: data.todayProfit >= 0 ? "text-accent" : "text-destructive", bg: data.todayProfit >= 0 ? "bg-accent/10" : "bg-destructive/10" },
    { label: "Sales Today", value: data.totalSalesToday.toString(), icon: ShoppingCart, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Products", value: data.totalProducts.toString(), icon: Package, color: "text-muted-foreground", bg: "bg-muted" },
    { label: "Low Stock", value: data.lowStockCount.toString(), icon: AlertTriangle, color: data.lowStockCount > 0 ? "text-warning" : "text-muted-foreground", bg: data.lowStockCount > 0 ? "bg-warning/10" : "bg-muted" },
  ];

  const goalProgress = Math.min(100, (monthlyRevenue / goalTarget) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          </div>
          <Card className="gradient-card text-white px-6 py-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center health-ring">
                <span className="text-2xl font-bold">{healthScore}</span>
              </div>
              <div>
                <p className="text-sm text-white/70">Business Health</p>
                <p className="font-bold">{healthEmoji} {healthLabel}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-lg font-bold">{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                7-Day Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={data.weeklyTrend}>
                  <Tooltip formatter={(v: number) => `KSh ${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(230, 75%, 58%)" strokeWidth={3} dot={{ fill: "hsl(230, 75%, 58%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {data.weeklyTrend.map(d => <span key={d.day}>{d.day}</span>)}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Goal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-secondary" />
                Monthly Revenue Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">KSh {monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">of KSh {goalTarget.toLocaleString()} target</p>
              </div>
              <Progress value={goalProgress} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">
                {goalProgress.toFixed(0)}% achieved this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                AI Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm py-1.5 px-3 rounded-lg bg-muted/50">
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentSales.length === 0 ? (
              <p className="text-muted-foreground text-sm">No sales today. Use Voice Log to record sales!</p>
            ) : (
              <div className="space-y-3">
                {data.recentSales.map((sale, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{sale.product_name}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(sale.created_at), "h:mm a")}</p>
                    </div>
                    <span className="font-bold text-primary">KSh {Number(sale.total_amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
