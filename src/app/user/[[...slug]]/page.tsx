import { redirect } from "next/navigation";

export default function LegacyUserRedirect({
  params,
}: {
  params: { slug?: string[] };
}) {
  const { slug } = params;
  const suffix = slug?.length ? `/${slug.join("/")}` : "";
  redirect(`/dashboard/user${suffix}`);
}
