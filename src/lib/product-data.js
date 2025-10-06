import { productsMock } from '../mocks/products';

export const getProductById = (productId) => {
  return productsMock.find((p) => p.id === productId) || null;
};

export const getRelatedProducts = (productId) => {
  const product = getProductById(productId);
  if (!product) {
    return [];
  }
  return productsMock.filter((p) => p.id !== productId && p.brand === product.brand).slice(0, 4);
};