import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, eachDayOfInterval, eachWeekOfInterval } from "date-fns";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  "hsl(230, 75%, 58%)",
  "hsl(260, 55%, 58%)",
  "hsl(170, 65%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 55%)",
  "hsl(200, 70%, 50%)",
];

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0, salesCount: 0 });

  useEffect(() => {
    if (!user) return;
    fetchReportData();
  }, [user, period]);

  const fetchReportData = async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const startDate = period === "week"
      ? format(startOfWeek(subWeeks(now, 0), { weekStartsOn: 1 }), "yyyy-MM-dd")
      : format(startOfMonth(now), "yyyy-MM-dd");
    const endDate = period === "week"
      ? format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd")
      : format(endOfMonth(now), "yyyy-MM-dd");

    const [salesRes, expensesRes] = await Promise.all([
      supabase.from("sales").select("*").eq("user_id", user.id).gte("sale_date", startDate).lte("sale_date", endDate),
      supabase.from("expenses").select("*").eq("user_id", user.id).gte("expense_date", startDate).lte("expense_date", endDate),
    ]);

    const sales = salesRes.data || [];
    const expenses = expensesRes.data || [];

    const totalRevenue = sales.reduce((s, sale) => s + Number(sale.total_amount), 0);
    const totalExpenses = expenses.reduce((s, exp) => s + Number(exp.amount), 0);
    setSummary({
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: totalRevenue - totalExpenses,
      salesCount: sales.length,
    });

    // Revenue trend by day
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = eachDayOfInterval({ start, end });
    const dailyRevenue = days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayRevenue = sales.filter(s => s.sale_date === dayStr).reduce((sum, s) => sum + Number(s.total_amount), 0);
      const dayExpense = expenses.filter(e => e.expense_date === dayStr).reduce((sum, e) => sum + Number(e.amount), 0);
      return { name: format(day, "EEE dd"), revenue: dayRevenue, expenses: dayExpense, profit: dayRevenue - dayExpense };
    });
    setRevenueData(dailyRevenue);

    // Top products
    const productMap: Record<string, { name: string; revenue: number; quantity: number }> = {};
    sales.forEach(s => {
      if (!productMap[s.product_name]) productMap[s.product_name] = { name: s.product_name, revenue: 0, quantity: 0 };
      productMap[s.product_name].revenue += Number(s.total_amount);
      productMap[s.product_name].quantity += s.quantity;
    });
    setTopProducts(Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 6));

    // Expense breakdown by category
    const catMap: Record<string, number> = {};
    expenses.forEach(e => {
      const cat = e.category || "General";
      catMap[cat] = (catMap[cat] || 0) + Number(e.amount);
    });
    setExpenseBreakdown(Object.entries(catMap).map(([name, value]) => ({ name, value })));

    setLoading(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Revenue, products & expense analytics</p>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Revenue", value: `KSh ${summary.revenue.toLocaleString()}`, color: "text-primary" },
            { label: "Expenses", value: `KSh ${summary.expenses.toLocaleString()}`, color: "text-destructive" },
            { label: "Net Profit", value: `KSh ${summary.profit.toLocaleString()}`, color: summary.profit >= 0 ? "text-accent" : "text-destructive" },
            { label: "Sales Count", value: summary.salesCount.toString(), color: "text-secondary" },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `KSh ${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(230, 75%, 58%)" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="hsl(0, 72%, 55%)" radius={[6, 6, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No sales data</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => `KSh ${v.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="hsl(260, 55%, 58%)" radius={[0, 6, 6, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {expenseBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No expense data</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {expenseBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `KSh ${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
