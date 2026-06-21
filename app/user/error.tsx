"use client";

import { Button } from "primereact/button";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function UserError({
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
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          An error occurred in your dashboard. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="bg-primary border-primary text-white">
            Try Again
          </Button>
          <Link href="/user/dashboard">
            <Button className="p-button-outlined">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
