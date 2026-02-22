import Link from 'next/link';
import { useRouter } from 'next/router';
import { Coffee, Cake, Fries, Star, Package } from 'lucide-react';

export default function MobileTopNav() {
  const router = useRouter();

  const navItems = [
    { href: '/beverages', label: 'Drinks', icon: Coffee },
    { href: '/desserts', label: 'Desserts', icon: Cake },
    { href: '/loaded-fries', label: 'Menu', icon: Fries },
    { href: '/reviews', label: 'Reviews', icon: Star },
    { href: '/orders', label: 'Orders', icon: Package },
  ];

  return (
    <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-3 py-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href || 
            (item.href === '/loaded-fries' && ['/beverages', '/desserts', '/loaded-fries', '/burgers'].includes(router.pathname));
          
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap font-semibold transition-all duration-300 text-sm ${
                isActive 
                  ? 'bg-gradient-to-r from-[#E94E24] to-red-600 text-white shadow-lg shadow-[#E94E24]/30' 
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800 hover:text-[#E94E24]'
              }`}>
                <Icon size={16} />
                {item.label}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
