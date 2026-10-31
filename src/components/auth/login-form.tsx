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
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      toast.success("Logged in successfully.");
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
    <Card className="w-full max-w-md mx-auto shadow-sm border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-heading text-foreground">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Enter your credentials to access your HateyHat account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-2 h-11 text-sm font-medium active:scale-[0.96] transition-transform"
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
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || googleLoading}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || googleLoading}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform font-medium"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
