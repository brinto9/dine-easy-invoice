
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Clock, Users } from 'lucide-react';
import { Invoice } from '@/pages/Index';

interface KOTModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const KOTModal = ({ invoice, onClose }: KOTModalProps) => {
  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5" />
            <span>Kitchen Order Ticket</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4" id="kot-content">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">BrintoPOS</h2>
            <p className="text-sm text-gray-600">Kitchen Order Ticket</p>
            <p className="text-lg font-semibold mt-2">Table #{invoice.tableNumber}</p>
          </div>

          {/* Order Info */}
          <Card className="bg-orange-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{invoice.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Order ID</p>
                    <p className="font-mono">{invoice.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Items to Prepare:</h3>
            {invoice.items.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.specialInstructions && (
                        <p className="text-sm text-red-600 mt-1 font-medium">
                          Special: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-600">
                        {item.quantity}x
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>Total Items: {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>{invoice.timestamp.toLocaleDateString()} - {invoice.timestamp.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Continue
          </Button>
          <Button onClick={handlePrint} className="flex-1 bg-orange-500 hover:bg-orange-600">
            Print KOT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
