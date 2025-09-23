import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import FlowList from "./pages/FlowList";
import FlowBuilderPage from "./pages/FlowBuilder";
import Monitoring from "./pages/Monitoring";
import Queue from "./pages/Queue";
import Integration from "./pages/Integration";
import Templates from "./pages/Templates";
import TemplateList from "./pages/TemplateList";
import TemplateCreator from "./pages/TemplateCreator";
import Documentation from "./pages/Documentation";
import APIConsole from "./pages/APIConsole";
import UserProfiles from "./pages/UserProfiles";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Observability from "./pages/Observability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/landing" element={<Landing />} /> */}
              <Route path="/sign-in" element={<SignIn />} />
            <Route path="/flows" element={<FlowList />} />
            <Route path="/flow-builder" element={<FlowBuilderPage />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/template-list" element={<TemplateList />} />
            <Route path="/template-creator" element={<TemplateCreator />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/api-console" element={<APIConsole />} />
            <Route path="/user-profiles" element={<UserProfiles />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/observability" element={<Observability />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
