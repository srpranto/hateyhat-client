"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn } from "@/lib/auth-client";
import { validateLoginInput } from "@/lib/validation";
import type { LoginFormErrors } from "@/types/event";
import { GOOGLE_LOGIN_KEY } from "@/components/layout/social-login-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleLogo } from "@/components/icons/google-logo";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, HeartHandshake } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateLoginInput({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to log in. Please check your credentials.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back to HateyHat!");
      router.push("/");
    } catch {
      toast.error("An error occurred during login. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(GOOGLE_LOGIN_KEY, "true");
      }
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(GOOGLE_LOGIN_KEY);
      }
      toast.error("Google sign in could not be initiated.");
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-border/80 bg-card rounded-3xl overflow-hidden">
      <CardHeader className="space-y-2 text-center p-6 sm:p-8 bg-muted/30 border-b border-border/70">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mx-auto">
          <HeartHandshake className="size-3.5" />
          <span>হাতে হাত • HateyHat Account</span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          Sign in to organize and join community causes across Dhaka
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-5">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-2.5 h-12 text-sm font-semibold rounded-xl border-border/80 hover:bg-muted active:scale-[0.97] transition-all"
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleLogo className="size-4" />
          )}
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center gap-2 my-2">
          <Separator className="flex-1" />
          <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">or sign in with email</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="sharmin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || googleLoading}
              className={`rounded-xl h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                className={`pr-10 rounded-xl h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all font-semibold rounded-xl shadow-md shadow-primary/20 text-sm"
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Sign In to HateyHat"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/70 p-5 bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
