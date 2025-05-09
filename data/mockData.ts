import { User } from '@/context/AuthContext';
import { Product, ProductCategory } from '@/context/ProductContext';
import { Order, OrderStatus } from '@/context/OrderContext';

// Mock user
export const MOCK_USER: User = {
  id: 'seller_1',
  name: 'John Smith',
  email: 'john@marketgo.com',
  phone: '+1234567890',
  storeName: 'Fresh Harvest Market',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
};

// Mock products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Organic Apples',
    price: 2.99,
    description: 'Fresh organic apples, locally sourced. Perfect for healthy snacks, baking, or cooking.',
    stock: 50,
    category: 'fruits',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: '2023-05-10T14:30:00Z',
    sellerId: 'seller_1',
  },
  {
    id: 'prod_2',
    name: 'Farm Fresh Eggs',
    price: 4.50,
    description: 'Free-range eggs from happy chickens. Rich in flavor and perfect for breakfast.',
    stock: 30,
    category: 'dairy',
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: '2023-05-12T09:15:00Z',
    sellerId: 'seller_1',
  },
  {
    id: 'prod_3',
    name: 'Artisan Sourdough Bread',
    price: 6.99,
    description: 'Handcrafted sourdough bread made with traditional fermentation methods.',
    stock: 15,
    category: 'bakery',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: '2023-05-15T11:45:00Z',
    sellerId: 'seller_1',
  },
  {
    id: 'prod_4',
    name: 'Fresh Spinach',
    price: 3.49,
    description: 'Organic spinach leaves, perfect for salads, smoothies, or cooking.',
    stock: 25,
    category: 'vegetables',
    image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: '2023-05-18T16:20:00Z',
    sellerId: 'seller_1',
  },
  {
    id: 'prod_5',
    name: 'Premium Coffee Beans',
    price: 12.99,
    description: 'Freshly roasted coffee beans sourced from sustainable farms.',
    stock: 40,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: '2023-05-20T10:30:00Z',
    sellerId: 'seller_1',
  },
];

// Mock orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 'order_1',
    customerId: 'cust_1',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    customerPhone: '+1987654321',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productName: 'Organic Apples',
        quantity: 3,
        unitPrice: 2.99,
        totalPrice: 8.97,
        image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        id: 'item_2',
        productId: 'prod_3',
        productName: 'Artisan Sourdough Bread',
        quantity: 1,
        unitPrice: 6.99,
        totalPrice: 6.99,
        image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    status: 'pending',
    totalAmount: 15.96,
    createdAt: '2023-06-01T08:45:00Z',
    updatedAt: '2023-06-01T08:45:00Z',
    shippingAddress: '123 Main St, Anytown, USA',
  },
  {
    id: 'order_2',
    customerId: 'cust_2',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@example.com',
    customerPhone: '+1123456789',
    items: [
      {
        id: 'item_3',
        productId: 'prod_2',
        productName: 'Farm Fresh Eggs',
        quantity: 2,
        unitPrice: 4.50,
        totalPrice: 9.00,
        image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        id: 'item_4',
        productId: 'prod_5',
        productName: 'Premium Coffee Beans',
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
        image: 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    status: 'processing',
    totalAmount: 21.99,
    createdAt: '2023-06-02T14:20:00Z',
    updatedAt: '2023-06-02T15:30:00Z',
    shippingAddress: '456 Oak Ave, Another City, USA',
  },
  {
    id: 'order_3',
    customerId: 'cust_3',
    customerName: 'Carol Martinez',
    customerEmail: 'carol@example.com',
    items: [
      {
        id: 'item_5',
        productId: 'prod_4',
        productName: 'Fresh Spinach',
        quantity: 2,
        unitPrice: 3.49,
        totalPrice: 6.98,
        image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        id: 'item_6',
        productId: 'prod_1',
        productName: 'Organic Apples',
        quantity: 4,
        unitPrice: 2.99,
        totalPrice: 11.96,
        image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    status: 'delivered',
    totalAmount: 18.94,
    createdAt: '2023-05-28T09:15:00Z',
    updatedAt: '2023-05-30T11:45:00Z',
    shippingAddress: '789 Pine Blvd, Somewhere, USA',
  },
  {
    id: 'order_4',
    customerId: 'cust_4',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    customerPhone: '+1567891234',
    items: [
      {
        id: 'item_7',
        productId: 'prod_3',
        productName: 'Artisan Sourdough Bread',
        quantity: 2,
        unitPrice: 6.99,
        totalPrice: 13.98,
        image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    status: 'shipped',
    totalAmount: 13.98,
    createdAt: '2023-06-05T16:30:00Z',
    updatedAt: '2023-06-06T09:20:00Z',
    shippingAddress: '101 Cedar St, Elsewhere, USA',
  },
];

// Mock sales data for charts
export const MOCK_SALES_DATA = [
  { date: 'Mon', amount: 120 },
  { date: 'Tue', amount: 150 },
  { date: 'Wed', amount: 200 },
  { date: 'Thu', amount: 180 },
  { date: 'Fri', amount: 250 },
  { date: 'Sat', amount: 300 },
  { date: 'Sun', amount: 290 },
];

// Mock top selling products
export const MOCK_TOP_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Organic Apples',
    totalSold: 145,
    revenue: 433.55,
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'prod_3',
    name: 'Artisan Sourdough Bread',
    totalSold: 98,
    revenue: 685.02,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'prod_2',
    name: 'Farm Fresh Eggs',
    totalSold: 87,
    revenue: 391.50,
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'prod_5',
    name: 'Premium Coffee Beans',
    totalSold: 56,
    revenue: 727.44,
    image: 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'prod_4',
    name: 'Fresh Spinach',
    totalSold: 35,
    revenue: 122.15,
    image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

// Mock summary data
export const MOCK_SUMMARY = {
  totalSales: 1490.67,
  totalOrders: 25,
  averageOrderValue: 59.63,
  salesGrowth: 12.5,
};