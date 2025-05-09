// Mock data for products and categories
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with our premium wireless headphones. These headphones feature active noise cancellation, long battery life, and comfortable ear cushions for extended listening sessions.',
    price: 129.99,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    variants: ['Black', 'White', 'Blue'],
    details: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '1 year'
    }
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness goals with this advanced smart watch. Features include heart rate monitoring, step tracking, sleep analysis, and water resistance up to 50 meters.',
    price: 89.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    rating: 4.2,
    reviews: 85,
    variants: ['Black', 'Silver'],
    details: {
      'Battery Life': '7 days',
      'Connectivity': 'Bluetooth 5.0',
      'Water Resistance': 'IP68',
      'Compatibility': 'iOS and Android'
    }
  },
  {
    id: '3',
    name: 'Leather Wallet',
    description: 'Handcrafted genuine leather wallet with multiple card slots and a coin pocket. The slim design fits comfortably in your pocket while providing ample storage for your essentials.',
    price: 49.99,
    image: 'https://images.pexels.com/photos/2252338/pexels-photo-2252338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Accessories',
    rating: 4.8,
    reviews: 210,
    variants: ['Brown', 'Black', 'Tan'],
    details: {
      'Material': 'Genuine Leather',
      'Dimensions': '4.5" x 3.5"',
      'Card Slots': '8',
      'Warranty': '2 years'
    }
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep your drinks hot or cold for hours with this vacuum-insulated stainless steel water bottle. Leak-proof design and durable construction make it perfect for outdoor activities or daily use.',
    price: 24.99,
    image: 'https://images.pexels.com/photos/4000091/pexels-photo-4000091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Home & Kitchen',
    rating: 4.3,
    reviews: 156,
    variants: ['Silver', 'Black', 'Blue', 'Red'],
    details: {
      'Capacity': '24 oz',
      'Material': '18/8 Stainless Steel',
      'Insulation': 'Double-wall vacuum',
      'Keeps Cold': '24 hours',
      'Keeps Hot': '12 hours'
    }
  },
  {
    id: '5',
    name: 'Cotton T-Shirt',
    description: 'Classic cotton t-shirt made from premium 100% organic cotton. Soft, breathable fabric with a comfortable fit. Perfect for everyday wear or layering.',
    price: 19.99,
    image: 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Clothing',
    rating: 4.0,
    reviews: 302,
    variants: ['Small', 'Medium', 'Large', 'X-Large'],
    details: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Made in': 'Portugal'
    }
  },
  {
    id: '6',
    name: 'Ceramic Coffee Mug',
    description: 'Elegant ceramic coffee mug with a comfortable handle and 12oz capacity. Microwave and dishwasher safe.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Home & Kitchen',
    rating: 4.6,
    reviews: 78,
    variants: ['White', 'Black', 'Navy'],
    details: {
      'Material': 'Ceramic',
      'Capacity': '12 oz',
      'Dishwasher Safe': 'Yes',
      'Microwave Safe': 'Yes'
    }
  },
  {
    id: '7',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek, low-profile design with LED indicator and anti-slip surface.',
    price: 29.99,
    image: 'https://images.pexels.com/photos/4526416/pexels-photo-4526416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    rating: 4.1,
    reviews: 64,
    variants: ['Black', 'White'],
    details: {
      'Input': '5V/2A, 9V/1.67A',
      'Output': 'Up to 10W',
      'Compatibility': 'Qi-enabled devices',
      'Features': 'LED indicator, Anti-slip surface'
    }
  },
  {
    id: '8',
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack with multiple compartments and padded laptop sleeve. Perfect for school, work, or travel.',
    price: 39.99,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Accessories',
    rating: 4.7,
    reviews: 109,
    variants: ['Navy', 'Gray', 'Olive'],
    details: {
      'Material': 'Canvas and Leather Trim',
      'Dimensions': '16" x 12" x 5"',
      'Laptop Compartment': 'Fits up to 15"',
      'Pockets': '3 exterior, 2 interior'
    }
  }
];

const mockCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Accessories' },
  { id: '4', name: 'Home & Kitchen' }
];

// Mock API functions with artificial delay
export const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

export const fetchCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
};

export const fetchProductById = (id: string | string[]) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 400);
  });
};

export const searchProducts = (query: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockProducts.filter(
        product => 
          product.name.toLowerCase().includes(query.toLowerCase()) || 
          product.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 500);
  });
};