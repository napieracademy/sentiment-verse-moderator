import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FacebookSDK from "./components/FacebookSDK";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FacebookCallback from "./pages/FacebookCallback";
import FacebookData from "./pages/FacebookData";
import DeleteUserData from "./pages/DeleteUserData";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Deauthorize from "./pages/facebook/Deauthorize";
import DeletionStatus from "./pages/facebook/DeletionStatus";
import Insights from "./pages/Insights";
import PostInsights from "./pages/PostInsights";
import Welcome from "./pages/Welcome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <FacebookSDK />
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/facebook-data" element={<Layout><FacebookData /></Layout>} />
          <Route path="/auth/facebook/callback" element={<Layout><FacebookCallback /></Layout>} />
          <Route path="/delete-user-data" element={<Layout><DeleteUserData /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
          <Route path="/cookie-policy" element={<Layout><CookiePolicy /></Layout>} />
          <Route path="/facebook/deauthorize" element={<Layout><Deauthorize /></Layout>} />
          <Route path="/deletion_status" element={<Layout><DeletionStatus /></Layout>} />
          <Route path="/facebook/deletion_status" element={<Layout><DeletionStatus /></Layout>} />
          <Route path="/insights" element={<Layout><Insights /></Layout>} />
          <Route path="/post-insights" element={<Layout><PostInsights /></Layout>} />
          <Route path="/welcome" element={<Layout><Welcome /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
