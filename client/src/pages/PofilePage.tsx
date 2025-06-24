import { useAuth } from "@/components/auth-provider";
import { Separator } from "@/components/ui/separator";
import { Camera, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function ProfilePage() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const { user, isUpdatingProfile, updateProfile } = useAuth();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      try {
        await updateProfile(base64Image);
      } catch (error) {
        toast.error("Failed to update avataar");
      }
    };
  };
  return (
    <div className="h-screen pt-28">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-orangy text-base rounded-xl p-6 space-y-8">
          <div className="text-center border-l-4 border-rose-500">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-zinc-500">Your profile information</p>
          </div>

          {/* profile picture update section */}
          <div className="flex flex-col items-center gap-4 ">
            <div className="relative">
              <img
                src={selectedImg || user?.avatar || "/placeholder.svg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5 text-base-500" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-500">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the icon to update your profile picture"}
            </p>
          </div>

          {/* User details section */}
          <div className="space-y-6">
            {/* User Username Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-500 flex items-center gap-2 pl-4 border-l-4 border-l-rose-500">
                <User className="size-4" />
                Username
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-slate-400">
                {user?.userName}
              </p>
            </div>

            {/* User Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-500 flex items-center gap-2 pl-4 border-l-4 border-l-rose-500">
                <Mail className="size-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          {/* additional information section */}
          <div className="pt-6 bg-base-300 rounded-xl p-6 pl-5 border border-rose-500 border-l-[6px]">
            <h2 className="text-slate-400">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Member Since</span>
                <span className="text-slate-500">
                  {user?.createdAt?.split("T")[0]}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
