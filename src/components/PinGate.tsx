import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePinVerification } from "@/hooks/usePinVerification";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, Lock, Loader2 } from "lucide-react";

interface PinGateProps {
  children: React.ReactNode;
  pageName?: string;
}

const PinGate = ({ children, pageName = "this page" }: PinGateProps) => {
  const { user } = useAuth();
  const { isVerified, verify } = usePinVerification();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [hasPin, setHasPin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user || isVerified) return;
    // Check if admin PIN is set
    supabase
      .from("profiles")
      .select("pin_code")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setHasPin(!!data?.pin_code);
      });
  }, [user, isVerified]);

  if (isVerified) return <>{children}</>;

  // Still loading PIN status
  if (hasPin === null) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // No PIN set — allow access but show warning
  if (!hasPin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-warning" />
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h2 className="text-xl font-bold">No Admin PIN Set</h2>
            <p className="text-sm text-muted-foreground">
              You haven't set an admin PIN yet. Set one in Settings to protect sensitive pages like {pageName}.
            </p>
          </div>
          <Button onClick={verify}>Continue Without PIN</Button>
        </div>
      </AppLayout>
    );
  }

  const handleVerify = async () => {
    if (pin.length < 4) {
      setError("Enter at least 4 digits");
      return;
    }
    setChecking(true);
    setError("");

    // Check admin PIN
    const { data: profile } = await supabase
      .from("profiles")
      .select("pin_code")
      .eq("user_id", user!.id)
      .single();

    if (profile?.pin_code === pin) {
      verify();
    } else {
      // Check employee PINs
      const { data: employee } = await supabase
        .from("employees")
        .select("name, is_active")
        .eq("user_id", user!.id)
        .eq("pin", pin)
        .single();

      if (employee?.is_active) {
        verify();
      } else {
        setError("Invalid PIN. Try again.");
        setPin("");
      }
    }
    setChecking(false);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle>Enter PIN</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your admin or employee PIN to access {pageName}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={pin}
                onChange={setPin}
                onComplete={handleVerify}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button
              onClick={handleVerify}
              disabled={checking || pin.length < 4}
              className="w-full"
            >
              {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Unlock
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PinGate;
