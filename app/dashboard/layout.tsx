import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#0c1221]">
      <Navigation />
      <main className="pt-8">
        {children}
      </main>
    </div>
  );
}