
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FacebookSDK from "./components/FacebookSDK";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import FacebookCallback from "./pages/FacebookCallback";
import PageData from "./pages/PageData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <FacebookSDK />
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/page-data" element={<PageData />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
