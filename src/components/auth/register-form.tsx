"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { validateRegisterInput, normalizeImageUrl } from "@/lib/validation";
import { getDefaultAvatar } from "@/lib/avatar";
import type { RegisterFormErrors } from "@/types/event";
import { GOOGLE_LOGIN_KEY } from "@/components/layout/social-login-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleLogo } from "@/components/icons/google-logo";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, HeartHandshake, Check, Circle } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect =
    searchParams.get("redirect") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("redirectTo");
  const redirectUrl =
    rawRedirect &&
    rawRedirect.startsWith("/") &&
    !rawRedirect.startsWith("/login") &&
    !rawRedirect.startsWith("/register")
      ? rawRedirect
      : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    if (error) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(GOOGLE_LOGIN_KEY);
      }
      let msg = "Google sign up could not be completed.";
      if (error === "access_denied") {
        msg = "Google sign-in was cancelled or access was denied.";
      } else if (error === "account_not_linked") {
        msg = "An account with this email already exists. Please log in with your email and password.";
      } else if (error === "email_not_found") {
        msg = "No email address was returned by Google.";
      } else if (errorDescription) {
        msg = errorDescription;
      }
      toast.error(msg);
    }
  }, [searchParams]);

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const criteriaMetCount = (hasMinLength ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasLowercase ? 1 : 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateRegisterInput({ name, email, photoURL, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const normalizedPhoto = normalizeImageUrl(photoURL);
      const avatarUrl = normalizedPhoto || getDefaultAvatar(name.trim());
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        image: avatarUrl,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to create account.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-session-change"));
      }
      toast.success("Account registered successfully.");
      router.push(redirectUrl);
      router.refresh();
    } catch {
      toast.error("An error occurred during registration. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(GOOGLE_LOGIN_KEY, "true");
      }
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const absoluteCallbackUrl = origin ? new URL(redirectUrl, origin).toString() : redirectUrl;
      const errorUrl =
        redirectUrl && redirectUrl !== "/"
          ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
          : "/register";
      const absoluteErrorUrl = origin ? new URL(errorUrl, origin).toString() : errorUrl;
      await signIn.social({
        provider: "google",
        callbackURL: absoluteCallbackUrl,
        errorCallbackURL: absoluteErrorUrl,
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
          <span>হাতে হাত • HateyHat</span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          Create an Account
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          Sign up to organize and participate in community events across Dhaka
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-5">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-2.5 h-12 text-sm font-semibold rounded-xl border-border/80 hover:bg-muted hover:border-primary/40 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
          <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">or sign up with email</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="register-name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Sharmin Akter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || googleLoading}
              className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="register-email"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="register-photo" className="text-sm font-medium">
                Profile Photo URL (Optional)
              </Label>
              <span className="text-[11px] text-muted-foreground">Optional image link</span>
            </div>
            <Input
              id="register-photo"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              disabled={loading || googleLoading}
              className={`rounded-xl h-11 ${errors.photoURL ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.photoURL && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.photoURL}</p>
            )}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground">Sample avatars:</span>
              {[
                { label: "Avatar 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
                { label: "Avatar 2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
                { label: "Avatar 3", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
              ].map((av) => (
                <button
                  type="button"
                  key={av.label}
                  onClick={() => {
                    setPhotoURL(av.url);
                    setErrors((prev) => ({ ...prev, photoURL: undefined }));
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-muted/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 border border-border/70 transition-all duration-150 cursor-pointer"
                >
                  {av.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters, uppercase & lowercase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                className={`pr-10 rounded-xl h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:scale-110 active:scale-95 p-1 transition-all cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                  <div
                    className={`h-full rounded-full transition-colors duration-300 ease-out ${
                      criteriaMetCount >= 1
                        ? criteriaMetCount === 1
                          ? "bg-destructive"
                          : criteriaMetCount === 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-colors duration-300 ease-out ${
                      criteriaMetCount >= 2
                        ? criteriaMetCount === 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-colors duration-300 ease-out ${
                      criteriaMetCount === 3 ? "bg-emerald-500" : "bg-muted"
                    }`}
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5 text-xs">
                  <div
                    className={`flex items-center gap-2 transition-colors ${
                      hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {hasMinLength ? (
                      <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="size-3.5 shrink-0 opacity-40" />
                    )}
                    <span>At least 6 characters</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 transition-colors ${
                      hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {hasUppercase ? (
                      <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="size-3.5 shrink-0 opacity-40" />
                    )}
                    <span>At least one uppercase letter (A-Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 transition-colors ${
                      hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {hasLowercase ? (
                      <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="size-3.5 shrink-0 opacity-40" />
                    )}
                    <span>At least one lowercase letter (a-z)</span>
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] font-semibold rounded-xl shadow-md shadow-primary/20 text-sm"
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/70 p-5 bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={
              redirectUrl && redirectUrl !== "/"
                ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
                : "/login"
            }
            className="text-primary font-bold hover:text-primary/80 hover:underline transition-colors duration-150"
          >
            Log in here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
