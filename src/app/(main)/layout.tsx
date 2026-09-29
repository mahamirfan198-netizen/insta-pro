import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/layout/Toast";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <ToastProvider>
      <div className="min-h-screen">
        <Sidebar username={user.username} />
        <main className="md:ml-60 pb-16 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}