import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface DashboardData {
  todayRevenue: number;
  todayExpenses: number;
  todayProfit: number;
  totalProducts: number;
  totalSalesToday: number;
  lowStockCount: number;
  recentSales: Array<{ product_name: string; total_amount: number; created_at: string }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    todayRevenue: 0,
    todayExpenses: 0,
    todayProfit: 0,
    totalProducts: 0,
    totalSalesToday: 0,
    lowStockCount: 0,
    recentSales: [],
  });
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    if (!user) return;
    const today = format(new Date(), "yyyy-MM-dd");

    const fetchData = async () => {
      const [salesRes, expensesRes, productsRes, lowStockRes] = await Promise.all([
        supabase.from("sales").select("*").eq("user_id", user.id).eq("sale_date", today),
        supabase.from("expenses").select("*").eq("user_id", user.id).eq("expense_date", today),
        supabase.from("products").select("*").eq("user_id", user.id),
        supabase.from("products").select("*").eq("user_id", user.id),
      ]);

      const sales = salesRes.data || [];
      const expenses = expensesRes.data || [];
      const products = productsRes.data || [];

      const todayRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
      const todayExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const lowStock = products.filter((p) => p.stock_quantity <= p.reorder_level);

      const profit = todayRevenue - todayExpenses;
      const margin = todayRevenue > 0 ? (profit / todayRevenue) * 100 : 0;
      const score = Math.min(100, Math.max(0, Math.round(50 + margin * 0.5 + (products.length > 0 ? 10 : 0) - lowStock.length * 5)));

      setHealthScore(score);
      setData({
        todayRevenue,
        todayExpenses,
        todayProfit: profit,
        totalProducts: products.length,
        totalSalesToday: sales.length,
        lowStockCount: lowStock.length,
        recentSales: sales.slice(-5).reverse(),
      });
    };

    fetchData();
  }, [user]);

  const healthColor = healthScore >= 70 ? "text-primary" : healthScore >= 40 ? "text-secondary" : "text-destructive";
  const healthLabel = healthScore >= 70 ? "🟢 Healthy" : healthScore >= 40 ? "🟡 Moderate" : "🔴 At Risk";

  const stats = [
    { label: "Today's Revenue", value: `KSh ${data.todayRevenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Today's Expenses", value: `KSh ${data.todayExpenses.toLocaleString()}`, icon: TrendingDown, color: "text-destructive" },
    { label: "Net Profit", value: `KSh ${data.todayProfit.toLocaleString()}`, icon: TrendingUp, color: data.todayProfit >= 0 ? "text-primary" : "text-destructive" },
    { label: "Sales Today", value: data.totalSalesToday.toString(), icon: ShoppingCart, color: "text-accent" },
    { label: "Products", value: data.totalProducts.toString(), icon: Package, color: "text-muted-foreground" },
    { label: "Low Stock", value: data.lowStockCount.toString(), icon: AlertTriangle, color: data.lowStockCount > 0 ? "text-secondary" : "text-muted-foreground" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Card className="px-4 py-2">
            <div className="text-center">
              <span className={`text-2xl font-bold ${healthColor}`}>{healthScore}</span>
              <p className="text-xs text-muted-foreground">{healthLabel}</p>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${color}`}>
                    <Icon className="h-5 w-5" />
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

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sales</CardTitle>
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
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(sale.created_at), "h:mm a")}
                      </p>
                    </div>
                    <span className="font-bold text-primary">
                      KSh {Number(sale.total_amount).toLocaleString()}
                    </span>
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
