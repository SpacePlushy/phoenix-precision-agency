import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeadsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Leads</h1>
        <p className="text-muted-foreground">Manage your contact form submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            View and manage leads from your contact form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No leads yet. When visitors submit your contact form, their information will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}