import { useState, useEffect } from "react";
import { Mail, Loader2, CreditCard, Calendar, ExternalLink, LogOut, DollarSign, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Subscription {
  id: string;
  status: string;
  amount: number;
  interval: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

interface Charge {
  id: string;
  amount: number;
  status: string;
  created: number;
  description: string;
}

interface DonationData {
  hasStripeAccount: boolean;
  subscriptions: Subscription[];
  charges: Charge[];
}

export default function ManageDonation() {
  const [step, setStep] = useState<"email" | "code" | "dashboard">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedSession = localStorage.getItem("donorSessionId");
    if (savedSession) {
      validateSession(savedSession);
    }
  }, []);

  const validateSession = async (sessionIdToValidate: string) => {
    try {
      const response = await fetch(`/api/donor/session/${sessionIdToValidate}`);
      if (response.ok) {
        setSessionId(sessionIdToValidate);
        setStep("dashboard");
        fetchDonations(sessionIdToValidate);
      } else {
        localStorage.removeItem("donorSessionId");
      }
    } catch {
      localStorage.removeItem("donorSessionId");
    }
  };

  const fetchDonations = async (sessionIdToUse: string) => {
    try {
      const response = await fetch(`/api/donor/donations/${sessionIdToUse}`);
      if (response.ok) {
        const data = await response.json();
        setDonationData(data);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/donor/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStep("code");
        toast({
          title: "Check your email",
          description: "We've sent a verification code to your email address.",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/donor/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok && data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("donorSessionId", data.sessionId);
        setStep("dashboard");
        fetchDonations(data.sessionId);
        toast({
          title: "Verified",
          description: "You're now logged in to your donor account.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagePayment = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/donor/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open payment management",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("donorSessionId");
    setSessionId(null);
    setStep("email");
    setEmail("");
    setCode("");
    setDonationData(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleDownloadReceipt = async (chargeId: string) => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/donor/receipt/${sessionId}/${chargeId}`);
      if (!response.ok) throw new Error('Failed to fetch receipt');
      
      const data = await response.json();
      
      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Donation Receipt - The Klara Project</title>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1E4D4A; padding-bottom: 20px; }
            .header h1 { color: #1E4D4A; margin: 0 0 5px 0; font-family: Georgia, serif; }
            .header p { color: #666; margin: 0; font-size: 14px; }
            .receipt-title { color: #1E4D4A; margin: 30px 0 20px 0; font-size: 18px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { color: #2D2A27; font-weight: 500; }
            .amount { color: #1E4D4A; font-size: 24px; font-weight: bold; }
            .tax-notice { background: rgba(201, 169, 98, 0.15); border-left: 4px solid #C9A962; padding: 15px; margin: 30px 0; font-size: 13px; color: #666; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>The Klara Project</h1>
            <p>Clarity for Christians in the Age of AI</p>
          </div>
          <h2 class="receipt-title">Donation Receipt</h2>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${data.date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Transaction ID:</span>
            <span class="detail-value">${data.chargeId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${data.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${data.paymentMethod}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Amount:</span>
            <span class="detail-value amount">${formatAmount(data.amount)}</span>
          </div>
          <div class="tax-notice">
            <strong>Tax Information:</strong> The Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, donations will be tax-deductible retroactive to our date of incorporation. Please retain this receipt for your records.
          </div>
          <div class="footer">
            <p>Thank you for your generous support!</p>
            <p>The Klara Project</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(receiptHtml);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      });
    }
  };

  const handleDownloadYTDStatement = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/donor/ytd-statement/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch statement');
      
      const data = await response.json();
      
      const donationsHtml = data.donations.map((d: { date: string; amount: number; id: string }) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${d.date}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${formatAmount(d.amount)}</td>
        </tr>
      `).join('');

      const statementHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${data.year} Giving Statement - The Klara Project</title>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1E4D4A; padding-bottom: 20px; }
            .header h1 { color: #1E4D4A; margin: 0 0 5px 0; font-family: Georgia, serif; }
            .header p { color: #666; margin: 0; font-size: 14px; }
            .statement-title { color: #1E4D4A; margin: 30px 0 10px 0; font-size: 18px; }
            .donor-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 10px 0; border-bottom: 2px solid #1E4D4A; color: #1E4D4A; }
            th:last-child { text-align: right; }
            .total-row { font-weight: bold; border-top: 2px solid #1E4D4A; }
            .total-row td { padding-top: 15px; }
            .total-amount { color: #1E4D4A; font-size: 20px; }
            .tax-notice { background: rgba(201, 169, 98, 0.15); border-left: 4px solid #C9A962; padding: 15px; margin: 30px 0; font-size: 13px; color: #666; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>The Klara Project</h1>
            <p>Clarity for Christians in the Age of AI</p>
          </div>
          <h2 class="statement-title">${data.year} Year-to-Date Giving Statement</h2>
          <div class="donor-info">
            <strong>Donor:</strong> ${data.email}<br>
            <strong>Statement Generated:</strong> ${data.generatedAt}
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${donationsHtml}
              <tr class="total-row">
                <td><strong>Total Giving (${data.year})</strong></td>
                <td style="text-align: right;" class="total-amount">${formatAmount(data.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
          <div class="tax-notice">
            <strong>Tax Information:</strong> The Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, donations will be tax-deductible retroactive to our date of incorporation. Please retain this statement for your records.
          </div>
          <div class="footer">
            <p>Thank you for your generous support!</p>
            <p>The Klara Project</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(statementHtml);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate statement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">
              Manage Your Donation
            </h1>
            <p className="text-charcoal-muted text-lg">
              View your giving history and update your payment preferences
            </p>
          </div>

          {step === "email" && (
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-teal" />
                  Enter Your Email
                </CardTitle>
                <CardDescription>
                  We'll send you a verification code to access your donor account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-teal text-cream"
                    disabled={isLoading}
                    data-testid="button-send-code"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "code" && (
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle>Enter Verification Code</CardTitle>
                <CardDescription>
                  We sent a 6-digit code to {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                      data-testid="input-code"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-teal text-cream"
                    disabled={isLoading}
                    data-testid="button-verify-code"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("email")}
                    data-testid="button-back-to-email"
                  >
                    Use a different email
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "dashboard" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>

              {donationData === null ? (
                <Card className="bg-card border-card-border">
                  <CardContent className="py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal mb-4" />
                    <p className="text-charcoal-muted">Loading your donation history...</p>
                  </CardContent>
                </Card>
              ) : donationData.hasStripeAccount ? (
                <>
                  <Card className="bg-card border-card-border">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-teal" />
                          Active Subscriptions
                        </CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleManagePayment}
                        disabled={isLoading}
                        data-testid="button-manage-payment"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Manage Payment
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {donationData.subscriptions.length === 0 ? (
                        <p className="text-charcoal-muted text-center py-4">
                          No active subscriptions
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {donationData.subscriptions.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-4 bg-cream-dark rounded-lg"
                              data-testid={`subscription-${sub.id}`}
                            >
                              <div>
                                <p className="font-semibold text-charcoal">
                                  {formatAmount(sub.amount)}/{sub.interval}
                                </p>
                                <p className="text-sm text-charcoal-muted">
                                  Next billing: {formatDate(sub.currentPeriodEnd)}
                                </p>
                              </div>
                              <Badge
                                variant={sub.status === "active" ? "default" : "secondary"}
                                className={sub.status === "active" ? "bg-teal" : ""}
                              >
                                {sub.cancelAtPeriodEnd ? "Canceling" : sub.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-card-border">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-teal" />
                        Payment History
                      </CardTitle>
                      {donationData.charges.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadYTDStatement}
                          disabled={isLoading}
                          data-testid="button-download-ytd"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {new Date().getFullYear()} Statement
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {donationData.charges.length === 0 ? (
                        <p className="text-charcoal-muted text-center py-4">
                          No payment history
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {donationData.charges.map((charge) => (
                            <div
                              key={charge.id}
                              className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-b-0"
                              data-testid={`charge-${charge.id}`}
                            >
                              <div className="flex-1">
                                <p className="font-medium text-charcoal">
                                  {formatAmount(charge.amount)}
                                </p>
                                <p className="text-sm text-charcoal-muted">
                                  {formatDate(charge.created)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {charge.status === "succeeded" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDownloadReceipt(charge.id)}
                                    title="Download Receipt"
                                    data-testid={`button-receipt-${charge.id}`}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                                <Badge
                                  variant={charge.status === "succeeded" ? "default" : "secondary"}
                                  className={charge.status === "succeeded" ? "bg-teal" : ""}
                                >
                                  {charge.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-card border-card-border">
                  <CardContent className="py-8 text-center">
                    <p className="text-charcoal-muted mb-4">
                      No donation history found for this email address.
                    </p>
                    <Button asChild className="bg-teal text-cream">
                      <a href="/donate" data-testid="link-make-donation">Make Your First Donation</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
