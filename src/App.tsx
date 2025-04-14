
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
import FacebookData from "./pages/FacebookData";
import DeleteUserData from "./pages/DeleteUserData";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Deauthorize from "./pages/facebook/Deauthorize";
import DeletionStatus from "./pages/facebook/DeletionStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <FacebookSDK />
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/page-data" element={<PageData />} />
          <Route path="/facebook-data" element={<FacebookData />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
          <Route path="/delete-user-data" element={<DeleteUserData />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/facebook/deauthorize" element={<Deauthorize />} />
          <Route path="/deletion_status" element={<DeletionStatus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
