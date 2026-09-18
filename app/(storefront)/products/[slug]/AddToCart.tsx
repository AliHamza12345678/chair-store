"use client"

import { useState } from "react"
import { Product, ProductVariant, ProductOption } from "@prisma/client"
import { Button } from "@/components/ui/Button"
import { formatCurrency } from "@/lib/format-currency"
import { useCartStore } from "@/features/cart/store"
import { toast } from "sonner"

interface AddToCartProps {
  product: Product & {
    variants: ProductVariant[]
    options: ProductOption[]
  }
}

export function AddToCart({ product }: AddToCartProps) {
  const addItem = useCartStore(state => state.addItem)
  
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    product.options.forEach(opt => {
      if (opt.values.length > 0) {
        initial[opt.name] = opt.values[0]
      }
    })
    return initial
  })

  // Find matching variant based on selected options
  const currentVariant = product.variants.find(variant => {
    const vOpts = variant.options as Record<string, string>
    if (!vOpts) return false
    return Object.entries(selectedOptions).every(([k, v]) => vOpts[k] === v)
  })

  const price = currentVariant?.price || product.price
  const isOutOfStock = currentVariant 
    ? currentVariant.inventory <= 0 
    : product.inventory <= 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      imageUrl: product.images[0] || "",
      variantId: currentVariant?.id,
      variantTitle: currentVariant?.title
    })
    toast.success("Added to cart")
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Price */}
      <div className="text-3xl font-medium tracking-tight">
        {formatCurrency(price)}
      </div>

      {/* Options Selection */}
      {product.options.length > 0 && (
        <div className="space-y-6">
          {product.options.map(option => (
            <div key={option.id} className="space-y-3">
              <span className="text-sm font-medium tracking-wide uppercase">{option.name}</span>
              <div className="flex flex-wrap gap-3">
                {option.values.map(val => {
                  const isSelected = selectedOptions[option.name] === val
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                      className={`px-4 py-2 text-sm rounded-full border transition-all ${
                        isSelected 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <Button 
          size="lg" 
          className="flex-1 rounded-full h-14 text-base tracking-wide uppercase"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}
