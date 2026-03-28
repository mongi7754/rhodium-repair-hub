import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FleetDashboard from "./pages/FleetDashboard";
import Fleet from "./pages/Fleet";
import Trips from "./pages/Trips";
import Drivers from "./pages/Drivers";
import LiveMap from "./pages/LiveMap";
import FuelMonitor from "./pages/FuelMonitor";
import FleetAlerts from "./pages/FleetAlerts";
import FleetReports from "./pages/FleetReports";
import Deliveries from "./pages/Deliveries";
import Maintenance from "./pages/Maintenance";
import Geofences from "./pages/Geofences";
import FleetSettings from "./pages/FleetSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<FleetDashboard />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/fuel" element={<FuelMonitor />} />
          <Route path="/alerts" element={<FleetAlerts />} />
          <Route path="/reports" element={<FleetReports />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/geofences" element={<Geofences />} />
          <Route path="/settings" element={<FleetSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
