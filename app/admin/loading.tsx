import { Dumbbell } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Dumbbell className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading admin panel...</p>
      </div>
    </div>
  );
}
