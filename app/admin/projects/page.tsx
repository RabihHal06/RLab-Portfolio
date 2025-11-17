'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Freelance Projects Management</h1>
        <p className="text-muted-foreground">
          Manage your freelance portfolio and project assets
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Projects Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Full CRUD interface for freelance projects coming soon. You can add items directly to the database for now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
