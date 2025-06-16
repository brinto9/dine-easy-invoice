
import { OrderItem } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface OrderCartProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

export const OrderCart = ({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  subtotal,
  tax,
  total,
  onCheckout
}: OrderCartProps) => {
  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Current Order</span>
          {orderItems.length > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-6">
        {orderItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No items in order</p>
            <p className="text-sm">Add items from menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderItems.map((item) => (
              <Card key={item.id} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <span className="font-semibold text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {orderItems.length > 0 && (
        <div className="p-6 border-t bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Proceed to Payment
            </Button>
            
            <Button
              onClick={onClearOrder}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Clear Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
