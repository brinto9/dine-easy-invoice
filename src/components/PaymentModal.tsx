
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Smartphone, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  total: number;
  onPayment: (paymentMethod: string) => void;
  onClose: () => void;
}

export const PaymentModal = ({ total, onPayment, onClose }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<string>('');
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote, color: 'bg-green-500' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'mobile', name: 'Mobile Payment', icon: Smartphone, color: 'bg-purple-500' },
  ];

  const handlePayment = () => {
    if (!selectedMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod === 'cash') {
      const cashValue = parseFloat(cashAmount);
      if (!cashValue || cashValue < total) {
        toast({
          title: "Insufficient cash amount",
          description: `Amount must be at least $${total.toFixed(2)}`,
          variant: "destructive",
        });
        return;
      }
    }

    onPayment(selectedMethod);
    toast({
      title: "Payment Successful!",
      description: `Payment of $${total.toFixed(2)} processed via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`,
    });
  };

  const change = selectedMethod === 'cash' && cashAmount 
    ? Math.max(0, parseFloat(cashAmount) - total)
    : 0;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Process Payment</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-green-600">${total.toFixed(2)}</p>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Payment Method</Label>
            <div className="grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedMethod === method.id
                        ? 'ring-2 ring-orange-500 bg-orange-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${method.color} text-white p-2 rounded-lg`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{method.name}</span>
                        {selectedMethod === method.id && (
                          <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cash Amount Input */}
          {selectedMethod === 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="cashAmount">Cash Amount Received</Label>
              <Input
                id="cashAmount"
                type="number"
                step="0.01"
                min={total}
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder={`Minimum: $${total.toFixed(2)}`}
                className="text-lg"
              />
              {change > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Change to return: ${change.toFixed(2)}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Complete Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
