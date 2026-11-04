import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and update your HateyHat profile details.",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl mx-auto mb-8">
        <SectionHeading
          badge="Account"
          title="Profile Settings"
          subtitle="Manage your name and profile picture displayed across HateyHat."
        />
      </div>
      <ProfileForm />
    </div>
  );
}
