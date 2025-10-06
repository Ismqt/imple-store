"use client"

import { useEffect } from "react"
import { Calendar, MapPin, CreditCard, Package, Receipt, ExternalLink, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styles/OrderDetailModal.css"

export default function OrderDetailModal({ order, isOpen, onClose }) {
  const navigate = useNavigate()

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden" // Prevenir scroll
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!order || !isOpen) return null

  const handleProductClick = (productName) => {
    const productId = productName.toLowerCase().includes("leche")
      ? "1"
      : productName.toLowerCase().includes("pan")
        ? "2"
        : productName.toLowerCase().includes("manzana")
          ? "3"
          : "1"

    onClose()
    navigate(`/producto/${productId}`)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "entregado":
        return "badge-entregado"
      case "pendiente":
        return "badge-pendiente"
      case "cancelado":
        return "badge-cancelado"
      default:
        return ""
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Modal Content */}
      <div className="modal-content">
        {/* Header con botón cerrar */}
        <div className="modal-header">
          <div className="modal-title">
            <Receipt className="modal-icon" />
            <span className="modal-title-text">
              Detalle del Pedido - Factura #{order.invoiceNumber}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Información general */}
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">
                <Calendar className="info-icon" />
                <span>Fecha del pedido:</span>
              </div>
              <p className="info-value">
                {new Date(order.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Package className="info-icon" />
                <span>Estado:</span>
              </div>
              <span className={`badge ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <MapPin className="info-icon" />
              <span>Dirección de entrega:</span>
            </div>
            <p className="info-value">{order.deliveryAddress}</p>
          </div>

          <hr className="divider" />

          {/* Productos */}
          <div className="section">
            <h3 className="section-title">Productos del pedido</h3>
            <div className="products-list">
              {order.items.map((item, index) => (
                <div key={index} className="product-card">
                  <div className="product-info">
                    <h4 className="product-name">{item.name}</h4>
                    <p className="product-details">
                      Cantidad: {item.quantity} | Precio unitario: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="product-actions">
                    <div className="product-total">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                    <button
                      className="btn-view-product"
                      onClick={() => handleProductClick(item.name)}
                    >
                      <ExternalLink size={14} />
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* Resumen de costos */}
          <div className="section">
            <h3 className="section-title">Resumen de costos</h3>
            <div className="cost-summary">
              <div className="cost-row">
                <span className="cost-label">Subtotal:</span>
                <span className="cost-value">${(order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="cost-row">
                <span className="cost-label">Envío:</span>
                <span className="cost-value">${(order.total * 0.05).toFixed(2)}</span>
              </div>
              <div className="cost-row">
                <span className="cost-label">Impuestos:</span>
                <span className="cost-value">${(order.total * 0.05).toFixed(2)}</span>
              </div>
              <hr className="cost-divider" />
              <div className="cost-row cost-total">
                <span>Total:</span>
                <span className="total-amount">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="info-item">
            <div className="info-label">
              <CreditCard className="info-icon" />
              <span>Método de pago:</span>
            </div>
            <p className="info-value payment-method">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </>
  )
}