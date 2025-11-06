import { getUser } from '@/utils/firebase-admin';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const userId = (await cookies()).get("__session")?.value;

  if (!userId) redirect("/user/login");
  
  try {
    const maybeUser = await getUser(userId);
    const role = maybeUser?.role;

    if (role !== "admin") redirect("/");

    return <>{children}</>;
  } catch (err) {
    console.error("Admin layout auth error:", err);
    redirect("/");
  }
}