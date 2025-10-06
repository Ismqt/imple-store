import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
  const { addToCart: addToCartContext } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async (product, quantity) => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));
    for (let i = 0; i < quantity; i++) {
      addToCartContext(product);
    }
    setIsLoading(false);
    return { success: true };
  };

  const buyNow = async (product, quantity) => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    return { success: true, orderId: `order_${Date.now()}` };
  };

  return { addToCart, buyNow, isLoading };
};