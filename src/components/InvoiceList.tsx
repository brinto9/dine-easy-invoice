
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Calendar, CreditCard, Edit, Save, X } from 'lucide-react';
import { Invoice } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateInvoice?: (invoice: Invoice) => void;
}

export const InvoiceList = ({ invoices, onUpdateInvoice }: InvoiceListProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editForm, setEditForm] = useState({
    tableNumber: '',
    paymentMethod: ''
  });
  const { toast } = useToast();

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'bkash': return 'bg-pink-100 text-pink-800';
      case 'nagad': return 'bg-red-100 text-red-800';
      case 'visa': return 'bg-blue-100 text-blue-800';
      case 'amex': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalVAT = invoices.reduce((sum, invoice) => sum + invoice.vat, 0);

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setEditForm({
      tableNumber: invoice.tableNumber,
      paymentMethod: invoice.paymentMethod
    });
  };

  const handleSaveEdit = () => {
    if (!editingInvoice || !onUpdateInvoice) return;

    const updatedInvoice: Invoice = {
      ...editingInvoice,
      tableNumber: editForm.tableNumber,
      paymentMethod: editForm.paymentMethod
    };

    onUpdateInvoice(updatedInvoice);
    setEditingInvoice(null);
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
    setEditForm({ tableNumber: '', paymentMethod: '' });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-600" />
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
              <CreditCard className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total VAT</p>
                <p className="text-2xl font-bold text-orange-600">৳{totalVAT.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Table */}
      <div className="border rounded-lg">
        {invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No invoices found</p>
            <p className="text-sm">Completed orders will appear here</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                  <TableCell>Table {invoice.tableNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{invoice.timestamp.toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{invoice.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{invoice.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentMethodColor(invoice.paymentMethod)}>
                      {invoice.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ৳{invoice.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onUpdateInvoice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={selectedInvoice !== null} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Invoice ID:</p>
                  <p className="font-mono">{selectedInvoice.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Table:</p>
                  <p>Table {selectedInvoice.tableNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date:</p>
                  <p>{selectedInvoice.timestamp.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time:</p>
                  <p>{selectedInvoice.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>৳{selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (5%):</span>
                  <span>৳{selectedInvoice.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">৳{selectedInvoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Method:</span>
                  <Badge className={getPaymentMethodColor(selectedInvoice.paymentMethod)}>
                    {selectedInvoice.paymentMethod}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={editingInvoice !== null} onOpenChange={handleCancelEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          
          {editingInvoice && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  value={editForm.tableNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tableNumber: e.target.value }))}
                  placeholder="Enter table number"
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="cash">Cash</option>
                  <option value="bkash">Bkash</option>
                  <option value="nagad">Nagad</option>
                  <option value="visa">Visa Card</option>
                  <option value="amex">Amex Card</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
