
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FacebookSDK from "./components/FacebookSDK";
import Index from "./pages/Index";
import SelectPage from "./pages/SelectPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import FacebookCallback from "./pages/FacebookCallback";
import DeleteUserData from "./pages/DeleteUserData"; 
import PageData from "./pages/PageData"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <FacebookSDK />
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/select-page" element={<SelectPage />} />
          <Route path="/page-data" element={<PageData />} /> {/* New route for Page Data */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
          <Route path="/delete-user-data" element={<DeleteUserData />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
