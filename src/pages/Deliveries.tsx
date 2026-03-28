import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => { fetchDeliveries(); }, []);

  const fetchDeliveries = async () => {
    const { data } = await supabase.from("deliveries").select("*").eq("user_id", DEMO_USER_ID).order("created_at", { ascending: false });
    setDeliveries(data || []);
  };

  const confirmDelivery = async (id: string) => {
    await supabase.from("deliveries").update({ status: "delivered", delivered_at: new Date().toISOString() }).eq("id", id);
    toast.success("Delivery confirmed");
    fetchDeliveries();
  };

  const statusBadge: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    in_transit: "bg-primary/10 text-primary",
    delivered: "bg-success/10 text-success",
    failed: "bg-destructive/10 text-destructive",
  };

  return (
    <FleetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Delivery Verification</h1>
          <p className="text-sm text-muted-foreground">{deliveries.length} deliveries tracked</p>
        </div>

        {deliveries.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No deliveries yet. Deliveries are created when trips are assigned.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deliveries.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{d.customer_name || "Customer"}</p>
                      <Badge className={statusBadge[d.status]}>{d.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.delivery_address || "No address"}</p>
                  </div>
                  {d.status !== "delivered" && (
                    <Button size="sm" onClick={() => confirmDelivery(d.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FleetLayout>
  );
};

export default Deliveries;
