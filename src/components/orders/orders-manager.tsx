"use client"

import { useState, useCallback } from "react"
import { OrderCard } from "./order-card"
import { OrderFilters } from "./order-filters"
import { OrderDetailModal } from "./order-detail-modal"
import { RecurringOrderModal } from "./recurring-order-modal"
import { useOrders } from "@/hooks/use-orders"
import type { Order } from "@/types/order"

export function OrdersManager() {
  const { orders, loading, error, createRecurringOrder, updateOrderItems } = useOrders()
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [recurringOrder, setRecurringOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)

  useState(() => {
    setFilteredOrders(orders)
  }, [orders])

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const handleRecurringOrder = (order: Order) => {
    setRecurringOrder(order)
    setIsRecurringModalOpen(true)
  }

  const handleFilterChange = useCallback((filtered: Order[]) => {
    setFilteredOrders(filtered)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Gestión de Pedidos</h1>
        <p className="text-muted-foreground text-lg">Administra todos tus pedidos de supermercado de forma eficiente</p>
      </header>

      <OrderFilters orders={orders} onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onOrderClick={handleOrderClick}
            onRecurringOrder={handleRecurringOrder}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No se encontraron pedidos que coincidan con los filtros aplicados
          </p>
        </div>
      )}

      <OrderDetailModal order={selectedOrder} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      <RecurringOrderModal
        order={recurringOrder}
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        onCreateRecurring={createRecurringOrder}
      />
    </div>
  )
}
