// ─── Account Order History Page ────────────────────────────────────────────────
// Full order history with luxury card layouts, status filters,
// item thumbnail previews, status tags, tracking step timeline, and pricing breakdown.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { OrdersClient, OrderData } from "./OrdersClient";

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);

  const rawOrders = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    include: {
      orderItems: {
        include: { product: true },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const orders: OrderData[] = rawOrders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    status: o.status,
    total: o.total,
    subtotal: o.subtotal,
    discount: o.discount,
    paymentMethod: o.paymentMethod,
    isPaid: o.isPaid,
    orderItems: o.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        images: item.product.images,
      },
    })),
    address: o.address
      ? {
          fullName: o.address.fullName,
          phone: o.address.phone,
          addressLine1: o.address.addressLine1,
          addressLine2: o.address.addressLine2,
          city: o.address.city,
          province: o.address.province,
          postalCode: o.address.postalCode,
          country: o.address.country,
        }
      : null,
  }));

  return <OrdersClient orders={orders} />;
}

