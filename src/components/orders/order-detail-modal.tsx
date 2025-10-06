"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, CreditCard, Package, Receipt, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Order } from "@/types/order"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const router = useRouter()

  if (!order) return null

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

  const handleProductClick = (productName: string) => {
    // Simular ID de producto basado en el nombre para la demo
    const productId = productName.toLowerCase().includes("leche")
      ? "1"
      : productName.toLowerCase().includes("pan")
        ? "2"
        : productName.toLowerCase().includes("manzana")
          ? "3"
          : "1"

    onClose()
    router.push(`/producto/${productId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Detalle del Pedido - Factura #{order.invoiceNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fecha del pedido:</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {new Date(order.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Estado:</span>
              </div>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
          </div>

          {/* Dirección de entrega */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dirección de entrega:</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">{order.deliveryAddress}</p>
          </div>

          <Separator />

          {/* Lista de productos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Productos del pedido</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity} | Precio unitario: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProductClick(item.name)}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumen de costos */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resumen de costos</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${(order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío:</span>
                <span>${(order.total * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuestos:</span>
                <span>${(order.total * 0.05).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Método de pago:</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">{order.paymentMethod}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
