import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Users, Truck, Bell } from "lucide-react";

const FleetSettings = () => {
  return (
    <FleetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-sm text-muted-foreground">Configure FleetIQ AI platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Role-based access control, PIN authentication, and audit logging are active.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Alert Rules</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Alerts for over-speeding, route deviation, fuel theft, and unauthorized stops.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4" /> Fleet Config</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>GPS tracking interval, fuel thresholds, and maintenance scheduling.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> User Management</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Super Admin, Operations Manager, Dispatcher, and Driver roles.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FleetLayout>
  );
};

export default FleetSettings;
