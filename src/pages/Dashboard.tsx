
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuManager } from '@/components/MenuManager';
import { InvoiceList } from '@/components/InvoiceList';
import { DashboardAuth } from '@/components/DashboardAuth';
import { ArrowLeft, Receipt, UtensilsCrossed, FileText, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MenuItem, Invoice, getGlobalInvoices, getGlobalMenuItems, updateGlobalMenuItems } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from global state
    setMenuItems(getGlobalMenuItems());
    setInvoices(getGlobalInvoices());
  }, []);

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setHasUnsavedChanges(true);
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [...prev, newItem]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    updateGlobalMenuItems(menuItems);
    setHasUnsavedChanges(false);
    toast({
      title: "Changes Saved",
      description: "Menu items have been updated successfully",
    });
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => 
      prev.map(invoice => invoice.id === updatedInvoice.id ? updatedInvoice : invoice)
    );
    toast({
      title: "Invoice Updated",
      description: `Invoice ${updatedInvoice.id} has been updated`,
    });
  };

  if (!isAuthenticated) {
    return <DashboardAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalOrders = invoices.length;

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
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <Button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
            <div className="text-right">
              <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">৳{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold text-orange-600">{menuItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UtensilsCrossed className="h-5 w-5" />
                    <span>Menu Items</span>
                  </div>
                  {hasUnsavedChanges && (
                    <span className="text-sm text-orange-600">● Unsaved changes</span>
                  )}
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
                <InvoiceList invoices={invoices} onUpdateInvoice={handleUpdateInvoice} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
