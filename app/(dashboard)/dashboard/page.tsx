import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Settings } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your Phoenix Precision dashboard</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#1a1f2e] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription className="text-gray-400">
              View your website performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Coming soon</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1f2e] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              Leads
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage your contact form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">No leads yet</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1f2e] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Manage your account</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}