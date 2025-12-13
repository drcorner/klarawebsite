import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import NotFound from "@/pages/not-found";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
