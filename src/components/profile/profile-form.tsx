"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { validateProfileInput, normalizeImageUrl } from "@/lib/validation";
import { getDefaultAvatar } from "@/lib/avatar";
import type { ProfileFormErrors } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, CalendarDays, CalendarCheck } from "lucide-react";

interface UserProfileData {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

function ProfileFormInner({ user }: { user: UserProfileData }) {
  const [name, setName] = useState(user.name);
  const [photoURL, setPhotoURL] = useState(user.image || "");
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateProfileInput({ name, photoURL });
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fix the validation errors.");
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const normalizedPhoto = normalizeImageUrl(photoURL);
      const avatarUrl = normalizedPhoto || getDefaultAvatar(name.trim());
      const res = await updateUser({
        name: name.trim(),
        image: avatarUrl,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to update profile.");
        setSubmitting(false);
        return;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-session-change"));
      }

      toast.success("Profile updated successfully.");
    } catch {
      toast.error("An error occurred while updating profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-lg border-border/80 bg-card rounded-3xl overflow-hidden">
      <CardHeader className="space-y-1 p-6 sm:p-8 bg-muted/30 border-b border-border/70">
        <CardTitle className="text-2xl font-bold font-heading text-foreground">
          Profile Settings
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Update your name and photo displayed across HateyHat.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/70">
          <Avatar className="size-20 border-2 border-primary/30 ring-2 ring-primary/10 shadow-xs">
            {photoURL && <AvatarImage src={normalizeImageUrl(photoURL)} alt={name || "User avatar"} />}
            <AvatarFallback className="bg-primary/15 text-primary font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <h3 className="font-bold text-foreground text-lg truncate font-heading">
              {name || "HateyHat Member"}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs text-primary font-semibold mt-1">
              Active Member
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-sm font-medium">
              Registered Email (Read-only)
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed rounded-xl h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-sm font-medium">
              Display Name
            </Label>
            <Input
              id="profile-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={`rounded-xl h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-photo" className="text-sm font-medium">
                Profile Photo URL (Optional)
              </Label>
              <span className="text-[11px] text-muted-foreground">Optional image link</span>
            </div>
            <Input
              id="profile-photo"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              disabled={submitting}
              className={`rounded-xl h-11 ${errors.photoURL ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.photoURL && (
              <p className="text-xs text-destructive mt-1 font-medium">{errors.photoURL}</p>
            )}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
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
                  className="text-[11px] px-2.5 py-1 rounded-md bg-muted/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 border border-border/70 transition-all duration-150 cursor-pointer font-medium"
                >
                  {av.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] font-semibold rounded-xl shadow-md shadow-primary/20"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Updating Profile...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>

        <div className="pt-6 border-t border-border/70 flex items-center justify-between text-xs">
          <Link
            href="/manage-events"
            className="text-primary font-semibold hover:text-primary/80 hover:translate-x-0.5 hover:underline flex items-center gap-1.5 transition-all duration-150"
          >
            <CalendarDays className="size-3.5" />
            <span>Manage Events</span>
          </Link>
          <Link
            href="/joined-events"
            className="text-primary font-semibold hover:text-primary/80 hover:translate-x-0.5 hover:underline flex items-center gap-1.5 transition-all duration-150"
          >
            <CalendarCheck className="size-3.5" />
            <span>Joined Events</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileForm() {
  const { data: session, isPending } = useSession();

  if (isPending || !session?.user) {
    return (
      <Card className="max-w-xl mx-auto shadow-sm border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  const userData: UserProfileData = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || "",
    image: session.user.image,
  };

  return <ProfileFormInner key={session.user.id} user={userData} />;
}
