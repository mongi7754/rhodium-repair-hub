import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mic, Shield, BarChart3, Package, Sparkles, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Lock, User, Building2 } from "lucide-react";

type AuthView = "login" | "signup" | "forgot";

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else if (view === "signup") {
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
        setView("login");
      } else if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({
          title: "Reset link sent! 📧",
          description: "Check your email for a password reset link.",
        });
        setView("login");
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

  const features = [
    { icon: Mic, title: "Voice-Powered Sales", desc: "Log sales by speaking naturally" },
    { icon: BarChart3, title: "Smart Analytics", desc: "AI-driven profit insights & forecasting" },
    { icon: Package, title: "Inventory Intelligence", desc: "Automated stock tracking & alerts" },
    { icon: Shield, title: "Bank-Grade Security", desc: "Enterprise-level data protection" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - hero */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-16 w-56 h-56 rounded-full bg-primary-foreground/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary-foreground/20 backdrop-blur-md flex items-center justify-center border border-primary-foreground/10">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold text-primary-foreground tracking-tight">BiasharaAI</span>
          </div>

          <div className="space-y-10 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight">
                Your business,<br />
                <span className="text-accent/90">supercharged</span><br />
                with AI.
              </h1>
              <p className="text-lg text-primary-foreground/70 leading-relaxed">
                The all-in-one AI platform that turns your daily hustle into data-driven decisions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group p-4 rounded-2xl bg-primary-foreground/[0.08] backdrop-blur-md border border-primary-foreground/10 hover:bg-primary-foreground/[0.14] transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-primary-foreground text-sm">{title}</h3>
                  <p className="text-primary-foreground/60 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 text-primary-foreground/50 text-sm">
            <div><span className="text-2xl font-bold text-primary-foreground">2K+</span><p>Active businesses</p></div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div><span className="text-2xl font-bold text-primary-foreground">98%</span><p>Uptime</p></div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div><span className="text-2xl font-bold text-primary-foreground">4.9★</span><p>User rating</p></div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-2xl font-extrabold text-primary">BiasharaAI</span>
          </div>

          <div className="space-y-2">
            {view === "forgot" && (
              <button onClick={() => setView("login")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </button>
            )}
            <h2 className="text-3xl font-bold tracking-tight">
              {view === "login" ? "Welcome back" : view === "signup" ? "Create your account" : "Reset your password"}
            </h2>
            <p className="text-muted-foreground">
              {view === "login"
                ? "Enter your credentials to access your dashboard"
                : view === "signup"
                ? "Start managing your business smarter today"
                : "We'll send you a link to reset your password"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="pl-10 h-12 rounded-xl border-border/60 focus:border-primary" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Business" className="pl-10 h-12 rounded-xl border-border/60 focus:border-primary" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 h-12 rounded-xl border-border/60 focus:border-primary" required />
              </div>
            </div>

            {view !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  {view === "login" && (
                    <button type="button" onClick={() => setView("forgot")} className="text-xs text-primary hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-xl border-border/60 focus:border-primary"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold gap-2 group" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Please wait...
                </div>
              ) : (
                <>
                  {view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Send Reset Link"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {view !== "forgot" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {view === "login" ? "New to BiasharaAI?" : "Already have an account?"}
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setView(view === "login" ? "signup" : "login")} className="w-full h-11 rounded-xl">
                {view === "login" ? "Create a free account" : "Sign in instead"}
              </Button>
            </>
          )}

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
