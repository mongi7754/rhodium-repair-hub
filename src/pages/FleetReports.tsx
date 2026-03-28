import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";
const COLORS = ["hsl(210,100%,45%)", "hsl(180,60%,40%)", "hsl(145,65%,42%)", "hsl(45,95%,55%)", "hsl(0,72%,50%)"];

const FleetReports = () => {
  const [tripsByStatus, setTripsByStatus] = useState<any[]>([]);
  const [fuelByVehicle, setFuelByVehicle] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    const [tripsRes, fuelRes, vehiclesRes] = await Promise.all([
      supabase.from("trips").select("status").eq("user_id", DEMO_USER_ID),
      supabase.from("fuel_logs").select("vehicle_id, fuel_amount, fuel_cost").eq("user_id", DEMO_USER_ID),
      supabase.from("vehicles").select("id, plate_number").eq("user_id", DEMO_USER_ID),
    ]);

    const trips = tripsRes.data || [];
    const statusCounts: Record<string, number> = {};
    trips.forEach((t) => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1; });
    setTripsByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

    const vehicles = vehiclesRes.data || [];
    const fuelData = fuelRes.data || [];
    const fuelMap: Record<string, number> = {};
    fuelData.forEach((f) => { fuelMap[f.vehicle_id] = (fuelMap[f.vehicle_id] || 0) + Number(f.fuel_cost); });
    setFuelByVehicle(
      Object.entries(fuelMap).map(([vid, cost]) => ({
        name: vehicles.find((v) => v.id === vid)?.plate_number || vid.slice(0, 8),
        cost,
      }))
    );
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fleet Reports</h1>
          <p className="text-sm text-muted-foreground">Analytics and performance insights</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Trips by Status</CardTitle></CardHeader>
            <CardContent>
              {tripsByStatus.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No trip data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={tripsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {tripsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Fuel Cost by Vehicle (KES)</CardTitle></CardHeader>
            <CardContent>
              {fuelByVehicle.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No fuel data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fuelByVehicle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="cost" fill="hsl(210,100%,45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FleetLayout>
  );
};

export default FleetReports;
