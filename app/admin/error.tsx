"use client";

import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="rounded-full bg-destructive/10 p-4 mx-auto w-fit">
          <Dumbbell className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">Admin Error</h1>
        <p className="text-muted-foreground">
          Something went wrong in the admin panel. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Link href="/admin/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
