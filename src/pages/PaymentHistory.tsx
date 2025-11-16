import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Receipt, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Payment {
  id: string;
  user_phone: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
  checkout_request_id: string;
  merchant_request_id: string;
  mpesa_receipt_number: string | null;
  transaction_date: string;
  status: string;
  result_desc: string | null;
  created_at: string;
}

const PaymentHistory = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async (phone?: string) => {
    const searchPhone = phone || phoneNumber;
    
    if (!searchPhone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to view payment history",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Format phone number
      let formattedPhone = searchPhone.replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_phone', formattedPhone)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPayments(data || []);

      if (!data || data.length === 0) {
        toast({
          title: "No Payments Found",
          description: "No payment history found for this phone number",
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payment history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ChatWidget />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Receipt className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment History</h1>
            <p className="text-lg text-muted-foreground">
              View all your M-Pesa transactions and booking deposits
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Your Payments</CardTitle>
              <CardDescription>
                Enter your phone number to view your payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678 or 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchPayments()}
                  />
                </div>
                <Button onClick={() => fetchPayments()} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          {hasSearched && (
            <div className="space-y-4">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(payment.status)}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {payment.transaction_desc || 'Payment'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {payment.account_reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            KSh {payment.amount.toLocaleString()}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Transaction Date</p>
                          <p className="font-medium">
                            {format(new Date(payment.transaction_date || payment.created_at), 'PPP p')}
                          </p>
                        </div>
                        
                        {payment.mpesa_receipt_number && (
                          <div>
                            <p className="text-sm text-muted-foreground">M-Pesa Receipt</p>
                            <p className="font-medium font-mono text-sm">
                              {payment.mpesa_receipt_number}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p className="font-medium">{payment.user_phone}</p>
                        </div>

                        {payment.result_desc && (
                          <div>
                            <p className="text-sm text-muted-foreground">Status Message</p>
                            <p className="font-medium text-sm">{payment.result_desc}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Payments Found</h3>
                    <p className="text-muted-foreground">
                      No payment history found for this phone number
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentHistory;
