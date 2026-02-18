import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { Home, Coffee, ShoppingCart, User, Star } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();
  const { getItemCount } = useCart();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/loaded-fries', label: 'Menu', icon: Coffee },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: getItemCount() },
    { href: '/reviews', label: 'Reviews', icon: Star },
    { href: '/orders', label: 'Orders', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Blur backdrop */}
      <div className="bg-black/95 backdrop-blur-xl border-t border-gray-800/50 shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href || 
              (item.href === '/loaded-fries' && ['/beverages', '/desserts', '/loaded-fries', '/burgers'].includes(router.pathname));
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-[#E94E24]' 
                    : 'text-gray-500 active:text-gray-300'
                }`}>
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 w-1 h-1 bg-[#E94E24] rounded-full" />
                  )}
                  
                  <div className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                    {item.badge > 0 && (
                      <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-red-500 to-[#E94E24] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center ring-2 ring-black">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-[#E94E24]' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* iPhone safe area */}
        <div className="h-safe-area-bottom" />
      </div>
    </nav>
  );
}
