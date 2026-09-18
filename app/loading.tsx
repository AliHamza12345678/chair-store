import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-medium uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  )
}
