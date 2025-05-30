import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { FirebaseErrorHandler } from './errorHandling';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  variants: string[];
  details: Record<string, string>;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
  stock?: number;
  isNew?: boolean;
  originalPrice?: number;
}

export interface Category {
  id: string;
  name: string;
}

// Helper function to ensure product has all required fields with default values
const ensureProductFields = (product: any): Product => {
  return {
    id: product.id || '',
    name: product.name || 'Unnamed Product',
    description: product.description || '',
    price: product.price || 0,
    image: product.image || 'https://via.placeholder.com/150',
    category: product.category || 'Uncategorized',
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    variants: product.variants || [],
    details: product.details || {},
    sellerId: product.sellerId || '',
    sellerName: product.sellerName || 'Unknown Seller',
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
    stock: product.stock || 0,
    isNew: product.isNew || false,
    originalPrice: product.originalPrice || product.price || 0
  };
};

// Fetch all products
export const fetchProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const productsQuery = query(
      productsRef,
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => ensureProductFields({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(FirebaseErrorHandler.handleError(error));
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(FirebaseErrorHandler.handleError(error));
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string | string[]) => {
  try {
    const productId = Array.isArray(id) ? id[0] : id;
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }

    return ensureProductFields({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(FirebaseErrorHandler.handleError(error));
  }
};

// Search products by name or description
export const searchProducts = async (searchQuery: string) => {
  try {
    const productsRef = collection(db, 'products');
    const searchQueryLower = searchQuery.toLowerCase();
    
    // Create a compound query to search in both name and description
    const productsQuery = query(
      productsRef,
      where('searchTerms', 'array-contains', searchQueryLower),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => ensureProductFields({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error(FirebaseErrorHandler.handleError(error));
  }
};

// Delete a product by ID
export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(FirebaseErrorHandler.handleError(error));
  }
};