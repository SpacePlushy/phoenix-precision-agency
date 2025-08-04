import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      <Card className="bg-[#1a1f2e] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
          <CardDescription className="text-gray-400">
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">User ID</p>
            <p className="text-white font-mono text-sm">{userId}</p>
          </div>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link href="https://accounts.clerk.dev/user" target="_blank">
                Manage Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}