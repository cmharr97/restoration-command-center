import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading, profile } = useAuth();
  const [authMode, setAuthMode] = useState<"landing" | "signin" | "signup">("landing");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--t-bg)", color: "#e85c0d", fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 600 }}>
        Loading ReCon Pro...
      </div>
    );
  }

  if (!user) {
    if (authMode === "landing") {
      return (
        <Landing
          onSignIn={() => setAuthMode("signin")}
          onDemo={() => setAuthMode("signup")}
          onCreateAccount={() => setAuthMode("signup")}
        />
      );
    }
    return <Auth initialMode={authMode === "signup" ? "signup" : "login"} onBack={() => setAuthMode("landing")} />;
  }

  // Route new owners to onboarding if they haven't completed it
  if (profile && profile.role === "owner" && !profile.onboarding_complete && !profile.company_id) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
