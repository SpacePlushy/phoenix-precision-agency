import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  
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
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Track your website performance and visitor metrics</p>
      </div>

      <Card className="bg-[#1a1f2e] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Coming Soon</CardTitle>
          <CardDescription className="text-gray-400">
            Analytics features are being developed and will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            We're working on integrating comprehensive analytics to help you understand your website's performance, 
            visitor behavior, and conversion metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}