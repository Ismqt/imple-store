"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Receipt, RotateCcw, ShoppingCart } from "lucide-react"
import type { Order } from "@/types/order"

interface OrderCardProps {
  order: Order
  onOrderClick: (order: Order) => void
  onRecurringOrder: (order: Order) => void
}

export function OrderCard({ order, onOrderClick, onRecurringOrder }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregado":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card
      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOrderClick(order)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1">Factura #{order.invoiceNumber}</h3>
            <p className="text-sm text-muted-foreground">{order.items.length} productos</p>
          </div>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(order.date).toLocaleDateString("es-ES")}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ShoppingCart className="w-4 h-4 mr-2" />${order.total.toFixed(2)}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">Productos principales:</p>
          <div className="space-y-1">
            {order.items.slice(0, 3).map((item, index) => (
              <p key={index} className="text-xs text-muted-foreground truncate">
                {item.quantity}x {item.name}
              </p>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-muted-foreground">+{order.items.length - 3} productos más</p>
            )}
          </div>
        </div>

        {/* Botones de hover */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-card to-transparent p-4 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                onOrderClick(order)
              }}
            >
              <Receipt className="w-3 h-3 mr-1" />
              Ver Factura
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation()
                onRecurringOrder(order)
              }}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Recurrente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
