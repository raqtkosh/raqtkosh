import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardRedirect from "@/components/DashboardRedirect";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: { role: true },
  });

  const role = dbUser?.role ?? "USER";

  return <DashboardRedirect role={role} />;
}
