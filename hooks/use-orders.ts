import { useState, useEffect } from "react"
import { getUserOrders } from "@/features/orders/queries"

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getUserOrders()
        setOrders(data || [])
      } catch (error) {
        console.error("Failed to fetch orders", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return { orders, isLoading }
}
