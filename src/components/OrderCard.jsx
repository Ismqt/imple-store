"use client"

import { Calendar, Package, User } from "lucide-react"

const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "badge-entregado"
    case "pending":
      return "badge-pendiente"
    case "cancelled":
      return "badge-cancelado"
    default:
      return ""
  }
}

export default function OrderCard({ order, onClick }) {
  if (!order) {
    return null
  }

  return (
    <div className="order-card" onClick={() => onClick(order)}>
      <div className="card-header">
        <h3 className="customer-name">
          <User className="icon" />
          {order.customerName}
        </h3>
        <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
      </div>
      <div className="card-body">
        <div className="info-row">
          <Calendar className="icon" />
          <span>{new Date(order.date).toLocaleDateString("es-ES")}</span>
        </div>
        <div className="info-row">
          <Package className="icon" />
          <span>{order.products.join(", ")}</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="amount">${order.amount.toFixed(2)}</span>
      </div>
    </div>
  )
}