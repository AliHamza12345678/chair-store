"use client"

import * as React from "react"
import { useState } from "react"
import { X, Crown, Users, ShoppingBag, MapPin, Heart, Star, Tag, MessageSquare, Plus, Trash2, Check, RefreshCcw, DollarSign, Calendar, ShieldCheck, Ticket } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { updateCustomerNotesAndTags } from "@/features/customers/actions"
import { CustomerJourneyTab } from "./CustomerJourneyTab"

interface CustomerProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  customer: any
}

type TabType = "journey" | "orders" | "engagement" | "addresses" | "notes"

export function CustomerProfileDrawer({ isOpen, onClose, customer }: CustomerProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("journey")
  const [notes, setNotes] = useState<string>(customer?.notes || "")
  const [tags, setTags] = useState<string[]>(customer?.tags || [])
  const [newTagInput, setNewTagInput] = useState<string>("")
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Reset local state when customer changes
  React.useEffect(() => {
    if (customer) {
      setNotes(customer.notes || "")
      setTags(customer.tags || [])
    }
  }, [customer])

  if (!isOpen || !customer) return null

  const ltv = customer.totalSpent || 0
  const orders = customer.orders || []
  const reviews = customer.reviews || []
  const wishlist = customer.wishlist || []
  const addresses = customer.addresses || []
  const isVip = ltv >= 100000 || orders.length >= 5

  const initial = (customer.name || customer.email || "C").charAt(0).toUpperCase()

  const handleAddTag = () => {
    if (!newTagInput.trim()) return
    const formattedTag = newTagInput.trim().toUpperCase()
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag])
    }
    setNewTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleSaveNotesAndTags = async () => {
    setIsSaving(true)
    const t = toast.loading("Saving customer profile notes & tags...")
    try {
      const res = await updateCustomerNotesAndTags(customer.id, notes, tags)
      if (res.success) {
        toast.success("Customer CRM records updated", { id: t })
      } else {
        toast.error(res.error || "Failed to update records", { id: t })
      }
    } catch {
      toast.error("Error saving customer record", { id: t })
    } finally {
      setIsSaving(false)
    }
  }

  // Predefined quick tag options
  const predefinedTags = ["VIP SPENDER", "WHOLESALE", "FREQUENT BUYER", "PRIORITY SUPPORT", "AT RISK", "FLAGGED"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Drawer / Modal Container */}
      <div className="relative z-10 w-full max-w-4xl bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] rounded-3xl border border-[var(--lm-border-default)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] glass-card animate-scale-spring">
        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)]">
          <div className="flex items-center gap-4">
            <div className="relative">
              {customer.image ? (
                <img src={customer.image} alt="" className="w-14 h-14 rounded-2xl object-cover border border-[var(--lm-border-default)] shadow-md" />
              ) : (
                <div className={`w-14 h-14 rounded-2xl ${isVip ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' : 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)]'} font-black text-xl flex items-center justify-center shadow-md`}>
                  {initial}
                </div>
              )}
              {isVip && (
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[var(--lm-text-primary)]">{customer.name || "Customer Account"}</h3>
                {isVip && (
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 text-[10px] font-extrabold uppercase">
                    VIP Member
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[var(--lm-text-muted)] mt-0.5">{customer.email} • ID #{customer.id.slice(-8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Lifetime Value</p>
              <p className="text-xl font-black text-[var(--lm-accent-text)] tabular-nums">{formatCurrency(ltv)}</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-[var(--lm-surface-primary)] hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors border border-[var(--lm-border-subtle)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[var(--lm-surface-secondary)] border-b border-[var(--lm-border-default)] overflow-x-auto custom-scrollbar">
          {[
            { id: "journey", label: "Overview & Journey", icon: Calendar },
            { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: "engagement", label: `Wishlist (${wishlist.length}) & Reviews (${reviews.length})`, icon: Heart },
            { id: "addresses", label: `Addresses (${addresses.length})`, icon: MapPin },
            { id: "notes", label: "Staff Notes & Tags", icon: Tag },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] shadow-md' : 'text-[var(--lm-text-muted)] hover:bg-[var(--lm-surface-hover)]'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Modal Body Tab Contents */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* TAB 1: Overview & Journey */}
          {activeTab === "journey" && (
            <CustomerJourneyTab customer={customer} />
          )}

          {/* TAB 2: Orders & Refunds */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider">Purchase History & Transactions</h4>
                <span className="text-xs text-[var(--lm-text-muted)] font-mono">Total Spend: {formatCurrency(ltv)}</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-muted)]">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">No orders placed yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o: any) => (
                    <div key={o.id} className="p-4 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--lm-border-subtle)] pb-2.5">
                        <div>
                          <span className="font-mono font-bold text-xs">Order #{o.id}</span>
                          <p className="text-[10px] text-[var(--lm-text-muted)]">{new Date(o.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-sm text-[var(--lm-text-primary)] tabular-nums">{formatCurrency(o.total)}</span>
                          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{o.status}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {(o.orderItems || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[var(--lm-text-primary)]">{item.product?.name || "Item"} × {item.quantity}</span>
                            <span className="font-mono text-[var(--lm-text-muted)]">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Coupon Info */}
                      {o.coupon && (
                        <div className="pt-2 border-t border-[var(--lm-border-subtle)] flex items-center gap-1.5 text-[10px] text-emerald-600">
                          <Ticket className="w-3 h-3" />
                          <span>Coupon Applied: <strong>{o.coupon.code}</strong> (-{formatCurrency(o.discount)})</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wishlist & Reviews */}
          {activeTab === "engagement" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wishlist Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Saved Wishlist ({wishlist.length})
                </h4>

                {wishlist.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-muted)] text-xs">
                    No wishlist items
                  </div>
                ) : (
                  <div className="space-y-2">
                    {wishlist.map((w: any) => (
                      <div key={w.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--lm-surface-primary)] shrink-0">
                          {w.product?.images?.[0] ? (
                            <img src={w.product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold">L</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--lm-text-primary)] truncate">{w.product?.name || "Product"}</p>
                          <p className="text-[10px] text-[var(--lm-text-muted)]">{formatCurrency(w.product?.price || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submitted Reviews */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  Customer Product Reviews ({reviews.length})
                </h4>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-muted)] text-xs">
                    No reviews submitted
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reviews.map((r: any) => (
                      <div key={r.id} className="p-3 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--lm-text-primary)] truncate">{r.product?.name || "Product"}</span>
                          <span className="text-amber-500 font-bold flex items-center gap-0.5">★ {r.rating}/5</span>
                        </div>
                        <p className="text-[11px] text-[var(--lm-text-muted)] italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Saved Addresses */}
          {activeTab === "addresses" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Shipping Addresses ({addresses.length})
              </h4>

              {addresses.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-muted)] text-xs">
                  No saved addresses
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((a: any) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--lm-text-primary)]">{a.fullName}</span>
                        {a.isDefault && (
                          <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[9px] font-bold">
                            Default Address
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--lm-text-secondary)]">{a.addressLine1} {a.addressLine2}</p>
                      <p className="text-[11px] text-[var(--lm-text-secondary)]">{a.city}, {a.province} {a.postalCode}</p>
                      <p className="text-[11px] font-semibold text-[var(--lm-accent-text)]">{a.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Staff Notes & Tags */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Internal Notes Textarea */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                  Internal CRM Staff Notes
                </h4>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Record internal admin notes, customer preferences, call summaries, or support history..."
                  rows={5}
                  className="w-full p-3.5 rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-xs text-[var(--lm-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 resize-none"
                />
              </div>

              {/* Tag Manager */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Customer Segmentation Tags
                </h4>

                {/* Tag Input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add custom tag (e.g. WHOLESALE, HIGH RISK)..."
                    className="bg-[var(--lm-surface-secondary)] text-xs h-9"
                  />
                  <Button type="button" size="sm" onClick={handleAddTag} className="h-9 px-3 text-xs bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)]">
                    <Plus className="w-3.5 h-3.5" />
                    Add Tag
                  </Button>
                </div>

                {/* Predefined Quick Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[var(--lm-text-muted)] font-semibold">Quick Tags:</span>
                  {predefinedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
                      className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                {/* Current Active Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map(t => (
                    <span key={t} className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] border border-[var(--lm-accent-border)] flex items-center gap-1.5">
                      <span>{t}</span>
                      <button onClick={() => handleRemoveTag(t)} className="hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Save Controls */}
              <div className="pt-4 border-t border-[var(--lm-border-default)] flex justify-end">
                <Button
                  type="button"
                  onClick={handleSaveNotesAndTags}
                  disabled={isSaving}
                  className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-xl h-10 px-6 gap-2 shadow-md"
                >
                  {isSaving ? "Saving Records..." : "Save CRM Notes & Tags"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
