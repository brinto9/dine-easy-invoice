
import { MenuItem } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Utensils } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
}

export const MenuItemCard = ({ item, onAddToOrder }: MenuItemCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
      <CardContent className="p-4">
        <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg mb-3 flex items-center justify-center">
          <Utensils className="h-8 w-8 text-orange-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          
          {item.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-green-600">
              ${item.price.toFixed(2)}
            </span>
            
            <Button
              size="sm"
              onClick={() => onAddToOrder(item)}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
