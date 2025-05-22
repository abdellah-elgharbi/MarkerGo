import { User } from '@/context/AuthContext';
import { Product, ProductCategory } from '@/context/ProductContext';
import { Order, OrderStatus } from '@/context/OrderContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// Mock user
export const MOCK_USER: User = {
  id: 'seller_1',
  name: 'John Smith',
  email: 'john@marketgo.com',
  phone: '+1234567890',
  storeName: 'Fresh Harvest Market',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
};

// Fetch all products for a seller
export async function fetchSellerProducts(sellerId) {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('sellerId', '==', sellerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch all orders for a seller
export async function fetchSellerOrders(sellerId) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('sellerId', '==', sellerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch sales data for the last 7 days (for chart)
export async function fetchSalesDataByDay(sellerId) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('sellerId', '==', sellerId), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  const salesByDay = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    salesByDay[key] = 0;
  }
  snapshot.forEach(doc => {
    const order = doc.data();
    if (order.date && order.totalAmount) {
      const d = new Date(order.date);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (salesByDay[key] !== undefined) {
        salesByDay[key] += order.totalAmount;
      }
    }
  });
  return Object.entries(salesByDay).map(([date, amount]) => ({ date, amount }));
}

// Fetch top selling products for a seller
export async function fetchTopSellingProducts(sellerId) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('sellerId', '==', sellerId));
  const snapshot = await getDocs(q);
  const productStats = {};
  snapshot.forEach(doc => {
    const order = doc.data();
    if (order.items) {
      order.items.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            id: item.productId,
            name: item.productName || '',
            totalSold: 0,
            revenue: 0,
            image: item.image || '',
          };
        }
        productStats[item.productId].totalSold += item.quantity || 0;
        productStats[item.productId].revenue += (item.totalPrice || 0);
      });
    }
  });
  // Return top 5 by totalSold
  return Object.values(productStats)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);
}

// Fetch summary stats for a seller
export async function fetchSellerSummary(sellerId) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('sellerId', '==', sellerId));
  const snapshot = await getDocs(q);
  let totalSales = 0;
  let totalOrders = 0;
  let deliveredOrders = 0;
  let pendingOrders = 0;
  let orderValues = [];
  snapshot.forEach(doc => {
    const order = doc.data();
    totalOrders += 1;
    totalSales += order.totalAmount || 0;
    orderValues.push(order.totalAmount || 0);
    if (order.status === 'delivered') deliveredOrders += 1;
    if (order.status === 'pending') pendingOrders += 1;
  });
  const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;
  // For sales growth, compare last 7 days to previous 7 days
  const now = new Date();
  let last7 = 0, prev7 = 0;
  snapshot.forEach(doc => {
    const order = doc.data();
    if (order.date && order.totalAmount) {
      const d = new Date(order.date);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 6) last7 += order.totalAmount;
      else if (diff <= 13) prev7 += order.totalAmount;
    }
  });
  const salesGrowth = prev7 ? ((last7 - prev7) / prev7) * 100 : 0;
  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    salesGrowth,
    deliveredOrders,
    pendingOrders,
  };
}

export async function fetchSellerStats(sellerId: string) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('sellerId', '==', sellerId));
  const snapshot = await getDocs(q);

  let totalOrders = 0;
  let totalSales = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;

  snapshot.forEach(doc => {
    const order = doc.data();
    totalOrders += 1;
    totalSales += order.totalAmount || 0;
    if (order.status === 'pending') pendingOrders += 1;
    if (order.status === 'delivered') deliveredOrders += 1;
  });

  return {
    totalOrders,
    totalSales,
    pendingOrders,
    deliveredOrders,
  };
}