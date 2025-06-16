
import { useState } from 'react';
import { MenuSection } from '@/components/MenuSection';
import { OrderCart } from '@/components/OrderCart';
import { PaymentModal } from '@/components/PaymentModal';
import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

const menuItems: MenuItem[] = [
  // Appetizers
  { id: '1', name: 'Bruschetta', price: 8.99, category: 'Appetizers', description: 'Fresh tomatoes, basil, and mozzarella on toasted bread' },
  { id: '2', name: 'Calamari Rings', price: 12.99, category: 'Appetizers', description: 'Crispy fried squid rings with marinara sauce' },
  { id: '3', name: 'Caesar Salad', price: 9.99, category: 'Appetizers', description: 'Romaine lettuce, parmesan, croutons, caesar dressing' },
  
  // Main Courses
  { id: '4', name: 'Grilled Salmon', price: 24.99, category: 'Main Courses', description: 'Atlantic salmon with lemon herb butter' },
  { id: '5', name: 'Ribeye Steak', price: 32.99, category: 'Main Courses', description: '12oz prime ribeye with garlic mashed potatoes' },
  { id: '6', name: 'Chicken Parmesan', price: 19.99, category: 'Main Courses', description: 'Breaded chicken breast with marinara and mozzarella' },
  { id: '7', name: 'Margherita Pizza', price: 16.99, category: 'Main Courses', description: 'Fresh mozzarella, tomatoes, and basil' },
  
  // Desserts
  { id: '8', name: 'Tiramisu', price: 7.99, category: 'Desserts', description: 'Classic Italian coffee-flavored dessert' },
  { id: '9', name: 'Chocolate Lava Cake', price: 8.99, category: 'Desserts', description: 'Warm chocolate cake with molten center' },
  
  // Beverages
  { id: '10', name: 'House Wine', price: 6.99, category: 'Beverages', description: 'Red or white wine by the glass' },
  { id: '11', name: 'Craft Beer', price: 5.99, category: 'Beverages', description: 'Local brewery selection' },
  { id: '12', name: 'Fresh Juice', price: 3.99, category: 'Beverages', description: 'Orange, apple, or cranberry juice' },
];

const Index = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [orders, setOrders] = useState<OrderItem[][]>([]);

  const categories = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages'];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromOrder = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = (paymentMethod: string) => {
    // Save the order to orders history
    setOrders([...orders, [...orderItems]]);
    
    // Clear current order
    setOrderItems([]);
    setShowPayment(false);
    
    // Show success message (you could add a toast here)
    console.log(`Payment processed via ${paymentMethod}`);
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant POS</h1>
              <p className="text-sm text-gray-500">Point of Sale System</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Table #1</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Menu Section */}
        <div className="flex-1 p-6">
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap ${
                    activeCategory === category 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "hover:bg-orange-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <MenuSection 
            items={filteredItems} 
            onAddToOrder={addToOrder}
          />
        </div>

        {/* Order Cart */}
        <div className="w-96 bg-white border-l shadow-lg">
          <OrderCart
            orderItems={orderItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromOrder}
            onClearOrder={clearOrder}
            subtotal={calculateSubtotal()}
            tax={calculateTax()}
            total={calculateTotal()}
            onCheckout={() => setShowPayment(true)}
          />
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={calculateTotal()}
          onPayment={handlePayment}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Index;
