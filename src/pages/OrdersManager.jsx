"use client"

import { useState, useEffect } from "react"
import OrderCard from "../components/OrderCard"
import OrderFilters from "../components/OrderFilters"
import OrderDetailModal from "../components/OrderDetailModal"
import React from 'react';
import "../styles/OrdersPage.css";

export default function OrdersManager() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    const mockOrders = [
      {
        id: 1,
        customerName: "Juan Pérez",
        status: "completed",
        date: "2025-10-01",
        amount: 150.0,
        products: ["Manzanas", "Leche"]
      },
      {
        id: 2,
        customerName: "Ana López",
        status: "pending",
        date: "2025-10-02",
        amount: 200.0,
        products: ["Pan", "Huevos"]
      }
    ];

    setOrders(mockOrders);
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }


  return (

    <>
      <div className="orders-manager">
        <div className="orders-header">
          <h1 className="orders-title">Gestión de Pedidos</h1>
          <p className="orders-subtitle">Administra todos tus pedidos de supermercado de forma eficiente</p>
        </div>

        <OrderFilters orders={orders} onFilterChange={setFilteredOrders} />

        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onClick={() => handleOrderClick(order)} />
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No se encontraron pedidos con los filtros aplicados</p>
          </div>
        )}
      </div>

      {}
      <OrderDetailModal order={selectedOrder} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}