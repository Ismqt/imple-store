"use client"

import { useState, useEffect } from "react"
import { Search, X, Calendar } from "lucide-react"
import "../styles/OrderFilters.css"

export default function OrderFilters({ orders, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    let filtered = [...orders]

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter((order) => new Date(order.date) >= new Date(dateFrom))
    }
    if (dateTo) {
      filtered = filtered.filter((order) => new Date(order.date) <= new Date(dateTo))
    }

    if (minAmount) {
      filtered = filtered.filter((order) => order.total >= Number.parseFloat(minAmount))
    }
    if (maxAmount) {
      filtered = filtered.filter((order) => order.total <= Number.parseFloat(maxAmount))
    }

    onFilterChange(filtered)

    const active = []
    if (searchTerm) active.push(`Búsqueda: ${searchTerm}`)
    if (statusFilter !== "all") active.push(`Estado: ${statusFilter}`)
    if (dateFrom) active.push(`Desde: ${new Date(dateFrom).toLocaleDateString("es-ES")}`)
    if (dateTo) active.push(`Hasta: ${new Date(dateTo).toLocaleDateString("es-ES")}`)
    if (minAmount) active.push(`Min: $${minAmount}`)
    if (maxAmount) active.push(`Max: $${maxAmount}`)

    setActiveFilters(active)
  }, [searchTerm, statusFilter, dateFrom, dateTo, minAmount, maxAmount, orders])

  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
    setMinAmount("")
    setMaxAmount("")
  }

  return (
    <div className="order-filters">
      <div className="filters-header">
        <h2 className="filters-title">
          <Search className="filters-title-icon" />
          Filtros
        </h2>
        {activeFilters.length > 0 && (
          <button onClick={clearAllFilters} className="clear-filters-btn">
            <X className="clear-filters-btn-icon" />
            Limpiar
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Búsqueda */}
        <div className="search-input-wrapper">
          <Search className="search-input-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Estado */}
        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="all">Todos</option>
            <option value="entregado">Entregado</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Fecha desde */}
        <div className="filter-group">
          <label className="filter-label">Desde</label>
          <div className="date-input-wrapper">
            <Calendar className="date-input-icon" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        {/* Fecha hasta */}
        <div className="filter-group">
          <label className="filter-label">Hasta</label>
          <div className="date-input-wrapper">
            <Calendar className="date-input-icon" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        {/* Monto mínimo */}
        <div className="filter-group">
          <label className="filter-label">Min $</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="amount-input"
            />
          </div>
        </div>

        {/* Monto máximo */}
        <div className="filter-group">
          <label className="filter-label">Max $</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              placeholder="999"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="amount-input"
            />
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div className="active-filters-section">
          <div className="active-filters-container">
            <span className="active-filters-label">Activos:</span>
            {activeFilters.map((filter, index) => (
              <span key={index} className="filter-badge">
                {filter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}