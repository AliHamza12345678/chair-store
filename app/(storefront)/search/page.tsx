"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Search as SearchIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const debouncedQuery = useDebounce(query, 400)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }
    setIsLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.products || []))
      .finally(() => setIsLoading(false))

    router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false })
  }, [debouncedQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto px-6 md:px-12 py-32 min-h-screen max-w-3xl">
      <div className="relative mb-16">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for chairs, sofas, tables..."
          className="pl-12 h-14 text-lg rounded-full"
        />
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Searching...</p>}

      {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
        <p className="text-muted-foreground text-sm">No products found for "{debouncedQuery}".</p>
      )}

      <div className="space-y-4">
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
              {product.images[0] && (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
