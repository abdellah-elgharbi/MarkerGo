import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MOCK_PRODUCTS } from '@/data/mockData';

export type ProductCategory = 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'bakery' | 'beverages' | 'other';

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: ProductCategory;
  image: string;
  createdAt: string;
  sellerId: string;
};

type ProductContextType = {
  products: Product[];
  getProductById: (id: string) => Product | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sellerId'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
};

// Create context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id) || null;
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'sellerId'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      sellerId: 'seller_1', // In a real app, this would be the current user's ID
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product => (product.id === id ? { ...product, ...updates } : product))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const value = {
    products,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

// Custom hook to use the product context
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}