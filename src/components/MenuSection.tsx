
import { MenuItem } from '@/pages/Index';
import { MenuItemCard } from './MenuItemCard';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
}

export const MenuSection = ({ items, onAddToOrder }: MenuSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAddToOrder={onAddToOrder}
        />
      ))}
    </div>
  );
};
