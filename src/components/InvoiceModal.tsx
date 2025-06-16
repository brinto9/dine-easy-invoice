
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Receipt, Printer, Eye, Trash, Lock } from 'lucide-react';
import { Invoice } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface InvoiceModalProps {
  invoice?: Invoice;
  invoices?: Invoice[];
  onClose: () => void;
}

export const InvoiceModal = ({ invoice, invoices, onClose }: InvoiceModalProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showVoidConfirm, setShowVoidConfirm] = useState<string | null>(null);
  const [voidPassword, setVoidPassword] = useState('');
  const { toast } = useToast();

  const VOID_PASSWORD = 'void123';

  const handlePrint = (invoiceToPrint: Invoice) => {
    // Store the invoice data for printing
    sessionStorage.setItem('printInvoice', JSON.stringify(invoiceToPrint));
    
    // Open a new window for printing
    const printWindow = window.open('/print-invoice', '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const handleVoid = (invoiceId: string) => {
    if (voidPassword !== VOID_PASSWORD) {
      toast({
        title: "Invalid Password",
        description: "Incorrect void password",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement void logic - for now just show success
    toast({
      title: "Invoice Voided",
      description: `Invoice ${invoiceId} has been voided`,
    });
    
    setShowVoidConfirm(null);
    setVoidPassword('');
  };

  // Single invoice view
  if (invoice) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Invoice</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" id="invoice-content">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold">BrintoPOS</h1>
              <p className="text-sm text-gray-600">Restaurant Invoice</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Invoice ID:</p>
                <p className="font-mono">{invoice.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Table:</p>
                <p>Table {invoice.tableNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p>{invoice.timestamp.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Time:</p>
                <p>{invoice.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h3 className="font-semibold">Items:</h3>
              {invoice.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>৳{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT (5%):</span>
                <span>৳{invoice.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">৳{invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Method:</span>
                <Badge>{invoice.paymentMethod}</Badge>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 border-t pt-4">
              <p>Thank you for your business!</p>
              <p>BrintoPOS - Restaurant Management System</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button onClick={() => handlePrint(invoice)} className="flex-1 bg-blue-500 hover:bg-blue-600">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Invoices list view
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Invoice History</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!invoices || invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No invoices found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell>Table {inv.tableNumber}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>{inv.timestamp.toLocaleDateString()}</p>
                        <p className="text-gray-500">{inv.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {inv.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ৳{inv.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge>{inv.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrint(inv)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVoidConfirm(inv.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>

        {/* Invoice Detail Dialog */}
        {selectedInvoice && (
          <InvoiceModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}

        {/* Void Confirmation Dialog */}
        {showVoidConfirm && (
          <Dialog open={true} onOpenChange={() => setShowVoidConfirm(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Void Invoice</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter password to void invoice {showVoidConfirm}
                </p>
                <Input
                  type="password"
                  placeholder="Enter void password"
                  value={voidPassword}
                  onChange={(e) => setVoidPassword(e.target.value)}
                />
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowVoidConfirm(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleVoid(showVoidConfirm)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Void Invoice
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Default void password: void123
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
