import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Loader2, Send, Check } from "lucide-react";

const VoiceLog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const [transcribedText, setTranscribedText] = useState("");
  const [parsedSale, setParsedSale] = useState<{
    product_name: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    payment_method: string;
  } | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Manual input fallback
  const [manualProduct, setManualProduct] = useState("");
  const [manualAmount, setManualAmount] = useState("");

  const handleVoice = useCallback(async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setTranscribedText(text);
        parseVoiceToSale(text);
      }
    } else {
      setTranscribedText("");
      setParsedSale(null);
      await startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  const parseVoiceToSale = async (text: string) => {
    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-voice-sale", {
        body: { text },
      });
      if (error) throw error;
      if (data?.sale) {
        setParsedSale(data.sale);
      } else {
        toast({
          title: "Could not parse",
          description: "Try saying something like: 'Nimeuza simu moja elfu nane'",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Parse error:", error);
      toast({
        title: "Parse failed",
        description: "Enter the sale manually below",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const saveSale = async () => {
    if (!user) return;
    setIsSaving(true);

    const saleData = parsedSale || {
      product_name: manualProduct,
      quantity: 1,
      unit_price: Number(manualAmount),
      total_amount: Number(manualAmount),
      payment_method: "cash",
    };

    if (!saleData.product_name || !saleData.total_amount) {
      toast({ title: "Missing info", description: "Enter product name and amount", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("sales").insert({
        user_id: user.id,
        product_name: saleData.product_name,
        quantity: saleData.quantity,
        unit_price: saleData.unit_price,
        total_amount: saleData.total_amount,
        payment_method: saleData.payment_method,
        logged_via: parsedSale ? "voice" : "manual",
        notes: transcribedText || "",
      });

      if (error) throw error;

      toast({
        title: "Sale logged! ✅",
        description: `${saleData.product_name} - KSh ${saleData.total_amount.toLocaleString()}`,
      });

      // Reset
      setTranscribedText("");
      setParsedSale(null);
      setManualProduct("");
      setManualAmount("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Voice Sales Log</h1>
          <p className="text-muted-foreground">
            Sema mauzo yako kwa Kiswahili au English
          </p>
        </div>

        {/* Voice Button */}
        <div className="flex justify-center">
          <button
            onClick={handleVoice}
            disabled={isProcessing || isParsing}
            className={`h-32 w-32 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-destructive voice-pulse"
                : "bg-primary hover:bg-primary/90"
            } text-primary-foreground`}
          >
            {isProcessing || isParsing ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isRecording
            ? "🔴 Listening... Tap to stop"
            : isProcessing
            ? "Processing audio..."
            : isParsing
            ? "Understanding your sale..."
            : "Tap the mic to speak"}
        </p>

        {/* Transcribed Text */}
        {transcribedText && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">You said:</p>
              <p className="font-medium mt-1">"{transcribedText}"</p>
            </CardContent>
          </Card>
        )}

        {/* Parsed Sale */}
        {parsedSale && (
          <Card className="border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                Sale Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Product:</span>
                  <p className="font-medium">{parsedSale.product_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{parsedSale.quantity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unit Price:</span>
                  <p className="font-medium">KSh {parsedSale.unit_price.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <p className="font-bold text-primary">KSh {parsedSale.total_amount.toLocaleString()}</p>
                </div>
              </div>
              <Button onClick={saveSale} disabled={isSaving} className="w-full mt-4">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm & Save Sale
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Manual Fallback */}
        {!parsedSale && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Or enter manually</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  value={manualProduct}
                  onChange={(e) => setManualProduct(e.target.value)}
                  placeholder="e.g. Simu, Charger, Earphones"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount">Amount (KSh)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="e.g. 8500"
                />
              </div>
              <Button
                onClick={saveSale}
                disabled={isSaving || !manualProduct || !manualAmount}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Log Sale
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default VoiceLog;
