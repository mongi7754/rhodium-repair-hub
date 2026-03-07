import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VoiceLog from "./pages/VoiceLog";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import Expenses from "./pages/Expenses";
import AppSettings from "./pages/AppSettings";
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/voice" element={<VoiceLog />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/settings" element={<AppSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
