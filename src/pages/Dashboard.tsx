
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuManager } from '@/components/MenuManager';
import { InvoiceList } from '@/components/InvoiceList';
import { ArrowLeft, Receipt, UtensilsCrossed, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MenuItem, Invoice } from '@/pages/Index';

const Dashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Bruschetta', price: 8.99, category: 'Appetizers', description: 'Fresh tomatoes, basil, and mozzarella on toasted bread' },
    { id: '2', name: 'Calamari Rings', price: 12.99, category: 'Appetizers', description: 'Crispy fried squid rings with marinara sauce' },
    { id: '3', name: 'Caesar Salad', price: 9.99, category: 'Appetizers', description: 'Romaine lettuce, parmesan, croutons, caesar dressing' },
    { id: '4', name: 'Grilled Salmon', price: 24.99, category: 'Main Courses', description: 'Atlantic salmon with lemon herb butter' },
    { id: '5', name: 'Ribeye Steak', price: 32.99, category: 'Main Courses', description: '12oz prime ribeye with garlic mashed potatoes' },
    { id: '6', name: 'Chicken Parmesan', price: 19.99, category: 'Main Courses', description: 'Breaded chicken breast with marinara and mozzarella' },
    { id: '7', name: 'Margherita Pizza', price: 16.99, category: 'Main Courses', description: 'Fresh mozzarella, tomatoes, and basil' },
    { id: '8', name: 'Tiramisu', price: 7.99, category: 'Desserts', description: 'Classic Italian coffee-flavored dessert' },
    { id: '9', name: 'Chocolate Lava Cake', price: 8.99, category: 'Desserts', description: 'Warm chocolate cake with molten center' },
    { id: '10', name: 'House Wine', price: 6.99, category: 'Beverages', description: 'Red or white wine by the glass' },
    { id: '11', name: 'Craft Beer', price: 5.99, category: 'Beverages', description: 'Local brewery selection' },
    { id: '12', name: 'Fresh Juice', price: 3.99, category: 'Beverages', description: 'Orange, apple, or cranberry juice' },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [...prev, newItem]);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to POS
              </Button>
            </Link>
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-sm text-gray-500">Manage Menu & View Reports</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="menu" className="flex items-center space-x-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span>Menu Management</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Invoice History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  <span>Menu Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MenuManager
                  menuItems={menuItems}
                  onUpdateItem={handleUpdateMenuItem}
                  onAddItem={handleAddMenuItem}
                  onDeleteItem={handleDeleteMenuItem}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Invoice History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceList invoices={invoices} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
