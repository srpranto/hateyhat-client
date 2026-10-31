"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { validateProfileInput } from "@/lib/validation";
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
      const res = await updateUser({
        name: name.trim(),
        image: photoURL.trim(),
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to update profile.");
        setSubmitting(false);
        return;
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
          Volunteer Profile Settings
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Manage your account information and avatar displayed across community drives and volunteer rosters.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/70">
          <Avatar className="size-20 border-2 border-primary/30 ring-2 ring-primary/10 shadow-xs">
            {photoURL && <AvatarImage src={photoURL} alt={name || "User avatar"} />}
            <AvatarFallback className="bg-primary/15 text-primary font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <h3 className="font-bold text-foreground text-lg truncate font-heading">
              {name || "HateyHat Volunteer"}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs text-primary font-semibold mt-1">
              Active Community Member
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
            <Label htmlFor="profile-photo" className="text-sm font-medium">
              Profile Photo URL
            </Label>
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
                  className="text-[11px] px-2 py-0.5 rounded-md bg-muted/80 hover:bg-primary/10 hover:text-primary border border-border/70 transition-colors cursor-pointer"
                >
                  {av.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all font-semibold rounded-xl shadow-md shadow-primary/20"
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
            className="text-primary font-semibold hover:underline flex items-center gap-1.5"
          >
            <CalendarDays className="size-3.5" />
            <span>Manage My Events</span>
          </Link>
          <Link
            href="/joined-events"
            className="text-primary font-semibold hover:underline flex items-center gap-1.5"
          >
            <CalendarCheck className="size-3.5" />
            <span>View Joined Events</span>
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
