import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardRedirect from "@/components/DashboardRedirect";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  const role = user.privateMetadata?.role as string;

  return <DashboardRedirect role={role} />;
}