import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mic, Shield, BarChart3, Package, Sparkles } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;

        toast({
          title: "Account created! 🎉",
          description: "Check your email to verify your account before logging in.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/10" style={{
              width: `${100 + i * 80}px`, height: `${100 + i * 80}px`,
              top: `${10 + i * 12}%`, left: `${-5 + i * 15}%`,
            }} />
          ))}
        </div>
        <div className="max-w-md text-white space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                BiasharaAI
              </h1>
            </div>
            <p className="text-xl text-white/80">
              AI-powered business intelligence for African SMEs
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Mic, text: "Voice-powered sales logging" },
              { icon: BarChart3, text: "Smart profit analytics & forecasting" },
              { icon: Package, text: "Intelligent inventory management" },
              { icon: Shield, text: "Bank-grade data security" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="lg:hidden mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-extrabold text-primary">BiasharaAI</h1>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome back!" : "Get started free"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to your business dashboard"
                : "Create your free business account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Shop" />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
