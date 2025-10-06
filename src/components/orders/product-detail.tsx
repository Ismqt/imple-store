"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShoppingCart,
  Zap,
  Clock,
  Plus,
  Minus,
  Package,
  Truck,
  Shield,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/types/product"
import { getProductById, getRelatedProducts } from "@/lib/product-data"
import { useCart } from "@/hooks/use-cart"
import { ProductRecurringModal } from "./product-recurring-modal"
import { useRouter } from "next/navigation"

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const { addToCart, buyNow, isLoading } = useCart()

  useEffect(() => {
    const productData = getProductById(productId)
    if (productData) {
      setProduct(productData)
      setRelatedProducts(getRelatedProducts(productId))
    }
  }, [productId])

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-brown-800 mb-2">Producto no encontrado</h2>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    const result = await addToCart(product, quantity)
    if (result.success) {
      // Mostrar toast de éxito
      console.log("Producto agregado al carrito")
    }
  }

  const handleBuyNow = async () => {
    const result = await buyNow(product, quantity)
    if (result.success) {
      // Redirigir a checkout o mostrar confirmación
      console.log("Compra realizada:", result.orderId)
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header con navegación */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-brown-700 hover:text-brown-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="text-sm text-brown-600">
          <span>Inicio</span> / <span>{product.category}</span> / <span className="font-medium">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-lg border border-cream-200 overflow-hidden">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? "border-orange-500" : "border-cream-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {product.category}
              </Badge>
              <Badge variant="outline" className="text-brown-600">
                {product.brand}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-brown-900 mb-2 font-lato">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-brown-600">
                {product.rating} ({product.reviewCount} reseñas)
              </span>
            </div>
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brown-900">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
                  <Badge className="bg-orange-500 text-white">-{discount}%</Badge>
                </>
              )}
            </div>
            <p className="text-sm text-brown-600">Precio por unidad</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">En stock ({product.stockQuantity} disponibles)</span>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-brown-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Selector de cantidad */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-brown-800">Cantidad:</span>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="h-10 w-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-brown-600">
              Total:{" "}
              <span className="font-semibold text-lg text-brown-900">
                ${(product.price * quantity).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button
              onClick={handleBuyNow}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLoading ? "Procesando..." : "Comprar Ahora"}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Al Carrito
              </Button>

              <Button
                onClick={() => setIsRecurringModalOpen(true)}
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                Recurrente
              </Button>
            </div>
          </div>

          {/* Acciones secundarias */}
          <div className="flex items-center gap-4 pt-4 border-t border-cream-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : "text-brown-600"}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
            </Button>

            <Button variant="ghost" size="sm" className="text-brown-600">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Beneficios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-2 text-sm text-brown-600">
              <Truck className="w-4 h-4 text-green-600" />
              <span>Envío gratis +$2000</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brown-600">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Garantía de calidad</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brown-600">
              <Award className="w-4 h-4 text-yellow-600" />
              <span>Producto premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs con información adicional */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="nutrition">Información Nutricional</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-brown-900 mb-3">Especificaciones</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brown-600">Peso:</span>
                      <span className="font-medium">{product.specifications?.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brown-600">Dimensiones:</span>
                      <span className="font-medium">{product.specifications?.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brown-600">Origen:</span>
                      <span className="font-medium">{product.specifications?.origin}</span>
                    </div>
                    {product.specifications?.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-brown-600">Vencimiento:</span>
                        <span className="font-medium">{product.specifications.expiryDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-brown-900 mb-3">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-cream-100 text-brown-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {product.nutritionalInfo ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{product.nutritionalInfo.calories}</div>
                    <div className="text-sm text-brown-600">Calorías</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brown-800">{product.nutritionalInfo.protein}</div>
                    <div className="text-sm text-brown-600">Proteínas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{product.nutritionalInfo.carbs}</div>
                    <div className="text-sm text-brown-600">Carbohidratos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{product.nutritionalInfo.fat}</div>
                    <div className="text-sm text-brown-600">Grasas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{product.nutritionalInfo.fiber}</div>
                    <div className="text-sm text-brown-600">Fibra</div>
                  </div>
                </div>
              ) : (
                <p className="text-brown-600">Información nutricional no disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-brown-900 mb-2">{product.reviewCount} reseñas</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-brown-800">{product.rating}</span>
                </div>
                <p className="text-brown-600">Las reseñas se cargarán próximamente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-6 font-lato">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-cream-50 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-brown-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brown-900">${relatedProduct.price.toLocaleString()}</span>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-600 bg-transparent">
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal de pedido recurrente */}
      <ProductRecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        product={product}
        quantity={quantity}
      />
    </div>
  )
}
