"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DashboardRedirect({ role }: { role: string }) {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    
    // if (!user || user.privateMetadata?.role !== role) {
    //   window.location.href = getTargetPath(role); 
    //   return;
    // }
    router.replace(getTargetPath(role));
  }, [isLoaded, user, role, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500" />
      <p className="mt-4 text-white text-lg">Loading dashboard...</p>
    </div>
  );
}

function getTargetPath(role: string) {
  switch (role) {
    case "USER": return "/dashboard/user";
    case "ADMIN": return "/dashboard/admin";
    case "SUPER_ADMIN": return "/dashboard/superadmin";
    default: return "/dashboard/user";
  }
}