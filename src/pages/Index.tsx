
import { useState } from 'react';
import { MenuSection } from '@/components/MenuSection';
import { OrderCart } from '@/components/OrderCart';
import { PaymentModal } from '@/components/PaymentModal';
import { Receipt, Settings, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

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

export interface Invoice {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  timestamp: Date;
}

const menuItems: MenuItem[] = [
  // Appetizers
  { id: '1', name: 'Bruschetta', price: 350, category: 'Appetizers', description: 'Fresh tomatoes, basil, and mozzarella on toasted bread' },
  { id: '2', name: 'Calamari Rings', price: 450, category: 'Appetizers', description: 'Crispy fried squid rings with marinara sauce' },
  { id: '3', name: 'Caesar Salad', price: 280, category: 'Appetizers', description: 'Romaine lettuce, parmesan, croutons, caesar dressing' },
  
  // Main Courses
  { id: '4', name: 'Grilled Salmon', price: 850, category: 'Main Courses', description: 'Atlantic salmon with lemon herb butter' },
  { id: '5', name: 'Ribeye Steak', price: 1200, category: 'Main Courses', description: '12oz prime ribeye with garlic mashed potatoes' },
  { id: '6', name: 'Chicken Parmesan', price: 650, category: 'Main Courses', description: 'Breaded chicken breast with marinara and mozzarella' },
  { id: '7', name: 'Margherita Pizza', price: 550, category: 'Main Courses', description: 'Fresh mozzarella, tomatoes, and basil' },
  
  // Desserts
  { id: '8', name: 'Tiramisu', price: 220, category: 'Desserts', description: 'Classic Italian coffee-flavored dessert' },
  { id: '9', name: 'Chocolate Lava Cake', price: 250, category: 'Desserts', description: 'Warm chocolate cake with molten center' },
  
  // Beverages
  { id: '10', name: 'House Wine', price: 180, category: 'Beverages', description: 'Red or white wine by the glass' },
  { id: '11', name: 'Craft Beer', price: 150, category: 'Beverages', description: 'Local brewery selection' },
  { id: '12', name: 'Fresh Juice', price: 120, category: 'Beverages', description: 'Orange, apple, or cranberry juice' },
];

// Global state for invoices and menu items
let globalInvoices: Invoice[] = [];
let globalMenuItems: MenuItem[] = [...menuItems];

const Index = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [tableNumber, setTableNumber] = useState('1');

  const categories = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  const tableNumbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  const filteredItems = activeCategory === 'All' 
    ? globalMenuItems 
    : globalMenuItems.filter(item => item.category === activeCategory);

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

  const calculateVAT = () => {
    return calculateSubtotal() * 0.05; // 5% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handlePayment = (paymentMethod: string) => {
    // Create invoice
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      tableNumber,
      items: [...orderItems],
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      total: calculateTotal(),
      paymentMethod,
      timestamp: new Date()
    };
    
    // Save to global invoices
    globalInvoices.push(newInvoice);
    
    // Clear current order
    setOrderItems([]);
    setShowPayment(false);
    
    console.log(`Payment processed via ${paymentMethod} for Table ${tableNumber}`);
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <Receipt className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Restaurant POS</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>
            <div className="text-right text-sm">
              <p className="text-gray-500">Table #{tableNumber}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-70px)]">
        {/* Menu Section */}
        <div className="flex-1 p-4">
          {/* Compact Table Selection and Category Filter */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Table className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Table:</span>
              </div>
              <Select value={tableNumber} onValueChange={setTableNumber}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tableNumbers.map((num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
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
        <div className="w-80 bg-white border-l shadow-lg">
          <OrderCart
            orderItems={orderItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromOrder}
            onClearOrder={clearOrder}
            subtotal={calculateSubtotal()}
            vat={calculateVAT()}
            total={calculateTotal()}
            onCheckout={() => setShowPayment(true)}
            tableNumber={tableNumber}
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

// Export functions to access global state
export const getGlobalInvoices = () => globalInvoices;
export const getGlobalMenuItems = () => globalMenuItems;
export const updateGlobalMenuItems = (items: MenuItem[]) => {
  globalMenuItems = items;
};

export default Index;
