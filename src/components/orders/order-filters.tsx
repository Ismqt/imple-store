"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X, CalendarIcon, DollarSign, Package } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Order } from "@/types/order"

interface OrderFiltersProps {
  orders: Order[]
  onFilterChange: (filteredOrders: Order[]) => void
}

export function OrderFilters({ orders, onFilterChange }: OrderFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    let filtered = [...orders]

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filtro por fecha
    if (dateFrom) {
      filtered = filtered.filter((order) => new Date(order.date) >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter((order) => new Date(order.date) <= dateTo)
    }

    // Filtro por monto
    if (minAmount) {
      filtered = filtered.filter((order) => order.total >= Number.parseFloat(minAmount))
    }
    if (maxAmount) {
      filtered = filtered.filter((order) => order.total <= Number.parseFloat(maxAmount))
    }

    // Filtro por producto específico
    if (productFilter) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.name.toLowerCase().includes(productFilter.toLowerCase())),
      )
    }

    onFilterChange(filtered)

    // Actualizar filtros activos
    const active = []
    if (searchTerm) active.push(`Búsqueda: ${searchTerm}`)
    if (statusFilter !== "all") active.push(`Estado: ${statusFilter}`)
    if (dateFrom) active.push(`Desde: ${format(dateFrom, "dd/MM/yyyy")}`)
    if (dateTo) active.push(`Hasta: ${format(dateTo, "dd/MM/yyyy")}`)
    if (minAmount) active.push(`Min: $${minAmount}`)
    if (maxAmount) active.push(`Max: $${maxAmount}`)
    if (productFilter) active.push(`Producto: ${productFilter}`)

    setActiveFilters(active)
  }, [searchTerm, statusFilter, dateFrom, dateTo, minAmount, maxAmount, productFilter, orders])

  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setMinAmount("")
    setMaxAmount("")
    setProductFilter("")
  }

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda general */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por factura o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por estado */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Estado del pedido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="entregado">Entregado</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por fecha desde */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: es }) : "Fecha desde"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
          </PopoverContent>
        </Popover>

        {/* Filtro por fecha hasta */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: es }) : "Fecha hasta"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Monto mínimo */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="number"
            placeholder="Monto mínimo"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Monto máximo */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="number"
            placeholder="Monto máximo"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por producto específico */}
        <div className="relative">
          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar producto específico..."
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            <X className="w-3 h-3 mr-1" />
            Limpiar todo
          </Button>
        </div>
      )}
    </div>
  )
}
