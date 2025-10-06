"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Package, Plus, Minus } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductRecurringModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  quantity: number
}

const frequencyOptions = [
  { days: 7, label: "Cada 7 días", description: "Entrega semanal" },
  { days: 14, label: "Cada 14 días", description: "Entrega quincenal" },
  { days: 30, label: "Cada 30 días", description: "Entrega mensual" },
]

export function ProductRecurringModal({
  isOpen,
  onClose,
  product,
  quantity: initialQuantity,
}: ProductRecurringModalProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<7 | 14 | 30>(14)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateRecurringOrder = async () => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const recurringOrder = {
        productId: product.id,
        quantity,
        frequency: selectedFrequency,
        startDate: new Date(startDate),
        nextDelivery: new Date(startDate),
      }

      console.log("Pedido recurrente creado:", recurringOrder)

      // Mostrar confirmación y cerrar modal
      onClose()
    } catch (error) {
      console.error("Error creating recurring order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNextDeliveries = () => {
    const deliveries = []
    const start = new Date(startDate)

    for (let i = 0; i < 3; i++) {
      const delivery = new Date(start)
      delivery.setDate(start.getDate() + selectedFrequency * i)
      deliveries.push(delivery)
    }

    return deliveries
  }

  const totalPerDelivery = product.price * quantity
  const monthlyEstimate =
    selectedFrequency === 7 ? totalPerDelivery * 4 : selectedFrequency === 14 ? totalPerDelivery * 2 : totalPerDelivery

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brown-900 font-lato">Configurar Pedido Recurrente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Producto seleccionado */}
          <Card className="bg-cream-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-brown-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-brown-600">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      ${product.price.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selector de cantidad */}
          <div className="space-y-3">
            <h3 className="font-semibold text-brown-900">Cantidad por entrega</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-cream-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-brown-600">
                Total por entrega:{" "}
                <span className="font-semibold text-brown-900">${totalPerDelivery.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Selector de frecuencia */}
          <div className="space-y-3">
            <h3 className="font-semibold text-brown-900">Frecuencia de entrega</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {frequencyOptions.map((option) => (
                <Card
                  key={option.days}
                  className={`cursor-pointer transition-all ${
                    selectedFrequency === option.days ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-cream-50"
                  }`}
                  onClick={() => setSelectedFrequency(option.days as 7 | 14 | 30)}
                >
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="font-medium text-brown-900">{option.label}</div>
                    <div className="text-sm text-brown-600">{option.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fecha de inicio */}
          <div className="space-y-3">
            <h3 className="font-semibold text-brown-900">Fecha de primera entrega</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brown-600" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview de entregas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-brown-900">Próximas entregas</h3>
            <div className="space-y-2">
              {calculateNextDeliveries().map((date, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-brown-700">
                    {date.toLocaleDateString("es-AR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-medium text-brown-900 ml-auto">
                    ${totalPerDelivery.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de costos */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-brown-900 mb-3">Resumen de costos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brown-600">Costo por entrega:</span>
                  <span className="font-medium">${totalPerDelivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-600">Estimado mensual:</span>
                  <span className="font-medium">${monthlyEstimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Ahorro estimado:</span>
                  <span className="font-medium">5% en cada entrega</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRecurringOrder}
              disabled={isLoading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? "Creando..." : "Crear Pedido Recurrente"}
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-brown-500 bg-cream-50 p-3 rounded-lg">
            <p className="mb-1">• Puedes modificar o cancelar tu pedido recurrente en cualquier momento</p>
            <p className="mb-1">• Te notificaremos 24 horas antes de cada entrega</p>
            <p>• Obtén 5% de descuento en cada entrega recurrente</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
