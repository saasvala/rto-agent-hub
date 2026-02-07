import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import PinLogin from "@/components/PinLogin";
import OfflineIndicator from "@/components/OfflineIndicator";
import Dashboard from "@/pages/Dashboard";
import Services from "@/pages/Services";
import Customers from "@/pages/Customers";
import Files from "@/pages/Files";
import NewFile from "@/pages/NewFile";
import FileDetail from "@/pages/FileDetail";
import Payments from "@/pages/Payments";
import More from "@/pages/More";
import Summary from "@/pages/Summary";
import Expenses from "@/pages/Expenses";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <PinLogin />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/files" element={<Files />} />
      <Route path="/new-file" element={<NewFile />} />
      <Route path="/file/:id" element={<FileDetail />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/more" element={<More />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <OfflineIndicator />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
