"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share2, Star, ShoppingCart, Zap, Plus, Minus, Package, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { getProductById, getRelatedProducts } from "@/lib/product-data"
import { useCart } from "@/hooks/use-cart"
import { useNavigate } from "react-router-dom"

export function ProductDetail({ productId }) {
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { addToCart, buyNow, isLoading } = useCart()

  useEffect(() => {
    const productData = getProductById(productId)
    if (productData) {
      setProduct(productData)
      const related = getRelatedProducts(productId)
        .filter((p) => p.id !== productId && p.category === productData.category)
        .slice(0, 4)
      setRelatedProducts(related)
    }
  }, [productId])

  const handleAddToCart = async () => {
    const result = await addToCart(product, quantity)
    if (result.success) {
      console.log("Producto agregado al carrito")
    }
  }

  const handleBuyNow = async () => {
    const result = await buyNow(product, quantity)
    if (result.success) {
      console.log("Compra realizada:", result.orderId)
    }
  }

  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/producto/${relatedProductId}`)
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="not-found-content">
          <h2>Producto no encontrado</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="product-detail-container">
      <div className="product-header">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft />
          Volver
        </Button>
        <div className="breadcrumb">
          <span>Inicio</span> / <span>{product.category}</span> / <span>{product.name}</span>
        </div>
      </div>

      <div className="product-main">
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[selectedImage] || "/placeholder.svg"} alt={product.name} />
          </div>

          {product.images.length > 1 && (
            <div className="thumbnail-list">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                >
                  <img src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-title-section">
            <div className="badges">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.brand}</Badge>
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="rating-section">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={i < Math.floor(product.rating) ? "star-filled" : "star-empty"} />
                ))}
              </div>
              <span className="rating-text">{product.rating}</span>
            </div>
          </div>

          <div className="price-section">
            <div className="price-row">
              <span className="current-price">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                  <Badge className="discount-badge">-{discount}%</Badge>
                </>
              )}
            </div>
            <p className="price-unit">Precio por unidad</p>
          </div>

          <div className="stock-indicator">
            <Package className="stock-icon" />
            <span>En stock ({product.stockQuantity} disponibles)</span>
          </div>

          <div className="description">
            <p>{product.description}</p>
          </div>

          <div className="quantity-section">
            <div className="quantity-controls-wrapper">
              <span className="quantity-label">Cantidad:</span>
              <div className="quantity-controls">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  <Minus />
                </Button>
                <span className="quantity-value">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="quantity-btn"
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>

          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Total a pagar:</span>
              <span className="total-amount">${(product.price * quantity).toLocaleString()}</span>
            </div>
            <p className="total-note">
              Precio final por {quantity} {quantity === 1 ? "unidad" : "unidades"}
            </p>
          </div>

          <div className="action-buttons">
            <Button onClick={handleBuyNow} disabled={isLoading} size="lg" className="buy-now-btn">
              <Zap />
              {isLoading ? "Procesando..." : "Comprar Ahora"}
            </Button>

            <div className="secondary-actions">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                variant="outline"
                className="add-cart-btn bg-transparent"
              >
                <ShoppingCart />
                Al Carrito
              </Button>

              <Button variant="ghost" size="sm" className="share-btn">
                <Share2 />
                Compartir
              </Button>
            </div>
          </div>

          <div className="product-features">
            <div className="feature-item">
              <Shield className="feature-icon" />
              <span>Garantía de calidad</span>
            </div>
            <div className="feature-item">
              <Award className="feature-icon" />
              <span>Producto premium</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details-section">
        <Card>
          <CardContent>
            <h3 className="details-title">Especificaciones</h3>
            <div className="specifications">
              <div className="spec-item">
                <span className="spec-label">Peso:</span>
                <span className="spec-value">{product.specifications?.weight}</span>
              </div>
            </div>

            <h3 className="details-title tags-title">Categoría</h3>
            <div className="category-display">
              <Badge variant="secondary" className="category-badge">
                {product.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2 className="related-title">Productos Relacionados</h2>
          <div className="related-grid">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="related-card">
                <CardContent>
                  <div className="related-image">
                    <img src={relatedProduct.images[0] || "/placeholder.svg"} alt={relatedProduct.name} />
                  </div>
                  <h3 className="related-name">{relatedProduct.name}</h3>
                  <div className="related-footer">
                    <span className="related-price">${relatedProduct.price.toLocaleString()}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="related-btn bg-transparent"
                      onClick={() => handleRelatedProductClick(relatedProduct.id)}
                    >
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}