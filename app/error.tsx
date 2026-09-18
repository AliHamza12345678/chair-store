"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="container max-w-lg text-center px-6">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16" />

        <h1 className="mb-4 text-4xl font-bold">
          Something went wrong
        </h1>

        <p className="mb-8 text-muted-foreground">
          An unexpected error occurred.
        </p>

        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()}>
            Try Again
          </Button>

          <Link href="/">
            <Button variant="outline">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}