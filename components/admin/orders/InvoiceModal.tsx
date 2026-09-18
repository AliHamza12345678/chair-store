"use client"

import * as React from "react"
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatCurrency } from "@/lib/format-currency"
import { Badge } from "@/components/ui/badge"

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const subtotal = order.subtotal || order.total || 0
  const discount = order.discount || 0
  const tax = subtotal * 0.05 // 5% tax estimate if zero
  const total = order.total || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Invoice Container */}
      <div className="relative z-10 w-full max-w-3xl bg-white text-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-neutral-200 animate-scale-spring">
        {/* Modal Controls Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white print:hidden border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight">Invoice Preview • Order #{order.id.slice(-8)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs rounded-xl gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoice
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar space-y-8 print:p-0 print:overflow-visible">
          {/* Company Branding & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-neutral-200 pb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-neutral-900">
                LUMINA <span className="font-light text-neutral-500 text-xl">FURNITURE</span>
              </h1>
              <p className="text-xs text-neutral-500 mt-1">Enterprise Luxury Living Solutions</p>
              <div className="mt-3 text-xs text-neutral-600 space-y-0.5">
                <p className="flex items-center gap-1.5"><Building className="w-3 h-3 text-neutral-400" /> Lumina Flagship Headquarters</p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-neutral-400" /> Gulberg III, MM Alam Road, Lahore</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-neutral-400" /> billing@lumina-store.com</p>
              </div>
            </div>

            <div className="sm:text-right space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 font-mono text-xs font-bold text-neutral-700">
                INVOICE #{order.id.toUpperCase().slice(-10)}
              </div>
              <div className="text-xs text-neutral-600 space-y-1">
                <p><span className="font-semibold text-neutral-900">Issue Date:</span> {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                <p><span className="font-semibold text-neutral-900">Payment Status:</span> {order.isPaid ? <span className="text-emerald-600 font-bold">PAID</span> : <span className="text-amber-600 font-bold">UNPAID / COD</span>}</p>
                <p><span className="font-semibold text-neutral-900">Payment Method:</span> {order.paymentMethod || "COD"}</p>
              </div>
            </div>
          </div>

          {/* Customer & Billing Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Billed To Customer</p>
              <h4 className="text-sm font-bold text-neutral-900 mt-1">{order.user?.name || "Valued Customer"}</h4>
              <p className="text-xs text-neutral-600 mt-0.5">{order.user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shipping Address</p>
              {order.address ? (
                <div className="text-xs text-neutral-700 mt-1 space-y-0.5">
                  <p className="font-medium text-neutral-900">{order.address.fullName}</p>
                  <p>{order.address.addressLine1} {order.address.addressLine2}</p>
                  <p>{order.address.city}, {order.address.province} {order.address.postalCode}</p>
                  <p className="font-medium">{order.address.country || "Pakistan"} • {order.address.phone}</p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 mt-1 italic">No physical address on record</p>
              )}
            </div>
          </div>

          {/* Itemized Products Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  <th className="py-3">Item Description</th>
                  <th className="py-3 text-center">Qty</th>
                  <th className="py-3 text-right">Unit Price</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs">
                {(order.orderItems || []).map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="py-3.5 pr-4">
                      <p className="font-bold text-neutral-900">{item.product?.name || "Product Item"}</p>
                      {item.variant && <p className="text-[10px] text-neutral-500">{item.variant.title}</p>}
                    </td>
                    <td className="py-3.5 text-center font-medium tabular-nums">{item.quantity}</td>
                    <td className="py-3.5 text-right font-medium tabular-nums">{formatCurrency(item.price)}</td>
                    <td className="py-3.5 text-right font-bold text-neutral-900 tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t-2 border-neutral-900 pt-6">
            <div className="text-xs text-neutral-500 max-w-sm space-y-1">
              <p className="font-bold text-neutral-900">Thank you for choosing Lumina.</p>
              <p>For questions or support regarding this invoice, please contact support@lumina-store.com or call +92 (42) 111-LUMINA.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-neutral-900 tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-semibold tabular-nums">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping:</span>
                <span className="font-semibold text-neutral-900 tabular-nums">Free Delivery</span>
              </div>
              <div className="flex justify-between text-neutral-900 font-black text-base border-t border-neutral-300 pt-2">
                <span>Total Due:</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Hidden on Print) */}
        <div className="px-8 py-4 bg-neutral-100 border-t border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-between print:hidden">
          <span>Official Digital Enterprise Invoice • Lumina Systems</span>
          <span>Order Reference #{order.id}</span>
        </div>
      </div>
    </div>
  )
}
