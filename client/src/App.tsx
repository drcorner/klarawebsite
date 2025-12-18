import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import WhyKlaraProject from "@/pages/WhyKlaraProject";
import Resources from "@/pages/Resources";
import GetInvolved from "@/pages/GetInvolved";
import Donate from "@/pages/Donate";
import DonateThankYou from "@/pages/DonateThankYou";
import ManageDonation from "@/pages/ManageDonation";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NextGeneration from "@/pages/NextGeneration";
import NotFound from "@/pages/not-found";
import CookieConsent, { trackPageVisit, hasConsent } from "@/components/CookieConsent";

function useScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
}

function usePageTracking() {
  const [location] = useLocation();
  
  useEffect(() => {
    if (hasConsent()) {
      trackPageVisit(location);
    }
  }, [location]);
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/why-klara-project" component={WhyKlaraProject} />
      <Route path="/resources" component={Resources} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/donate" component={Donate} />
      <Route path="/donate/thank-you" component={DonateThankYou} />
      <Route path="/manage-donation" component={ManageDonation} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/next-generation" component={NextGeneration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  useScrollToTop();
  usePageTracking();
  
  return (
    <>
      <Router />
      <CookieConsent />
    </>
  );
}

function App() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey || ""}>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}

export default App;
