import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { MOCK_PRODUCTS } from '@/data/mockData';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

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

  // Fetch products from Firestore
  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id) || null;
  }, [products]);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'sellerId'>) => {
    try {
      const productsRef = collection(db, 'products');
      const newProduct = {
        ...product,
        createdAt: serverTimestamp(),
        sellerId: 'seller_1', // In a real app, this would be the current user's ID
      };
      
      const docRef = await addDoc(productsRef, newProduct);
      
      // Update local state with the new product
      setProducts(prev => [{
        ...newProduct,
        id: docRef.id,
        createdAt: new Date().toISOString(),
      }, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback to local state update if Firebase update fails
      const newProduct: Product = {
        ...product,
        id: `prod_${Date.now()}`,
        createdAt: new Date().toISOString(),
        sellerId: 'seller_1',
      };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      // Fallback to local state update if Firebase update fails
      setProducts(prev =>
        prev.map(product => (product.id === id ? { ...product, ...updates } : product))
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Fallback to local state update if Firebase update fails
      setProducts(prev => prev.filter(product => product.id !== id));
    }
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