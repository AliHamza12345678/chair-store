import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-bold tracking-tighter text-secondary">404</h1>
      <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full">Back to Home</Button>
      </Link>
    </div>
  )
}
