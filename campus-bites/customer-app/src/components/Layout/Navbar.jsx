import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X, Sparkles, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/beverages', label: 'Beverages', emoji: '☕' },
    { href: '/desserts', label: 'Desserts', emoji: '🍰' },
    { href: '/loaded-fries', label: 'Loaded Fries', emoji: '🍟' },
    { href: '/reviews', label: 'Reviews', emoji: '⭐' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-gray-800' 
        : 'bg-black/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E94E24] to-red-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                <img src="/logo.png" alt="Lock N Load" className="relative w-14 h-14 object-cover rounded-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-[#E94E24]/30" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black bg-gradient-to-r from-[#E94E24] via-red-500 to-[#E94E24] bg-clip-text text-transparent whitespace-nowrap leading-none">
                  Lock N Load
                </span>
                <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase">Premium Loaded Fries</span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-800">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  router.pathname === link.href
                    ? 'bg-gradient-to-r from-[#E94E24] to-red-600 text-white shadow-lg shadow-[#E94E24]/30 scale-105'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-[#E94E24]'
                }`}>
                  <span className="text-lg">{link.emoji}</span>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Orders - Only show when logged in */}
            {user && (
              <Link href="/orders">
                <button className="relative p-3 bg-gray-900 hover:bg-gray-800 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg border border-gray-800" title="My Orders">
                  <Package size={22} className="text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <button className="relative p-3 bg-gray-900 hover:bg-gray-800 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg border border-gray-800">
                <ShoppingCart size={22} className="text-[#E94E24] group-hover:scale-110 transition-transform duration-300" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#E94E24] to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-3 bg-gray-900 px-4 py-2.5 rounded-2xl border border-gray-800 shadow-sm">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#E94E24] to-red-600 rounded-xl flex items-center justify-center shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-200 max-w-[100px] truncate">
                    {user.displayName || user.name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 hover:bg-gray-800 rounded-xl transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link href="/login">
                  <button className="px-5 py-2.5 text-gray-300 font-semibold hover:text-[#E94E24] hover:bg-gray-900 rounded-xl transition-all duration-300">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-[#E94E24] to-red-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#E94E24]/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    <Sparkles size={16} />
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 hover:bg-gray-800 rounded-xl transition-all"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} className="text-white" /> : <MenuIcon size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          showMobileMenu ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-gray-800 mt-2">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer ${
                      router.pathname === link.href
                        ? 'bg-gradient-to-r from-[#E94E24] to-red-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 active:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{link.emoji}</span>
                    <span className="text-lg">{link.label}</span>
                    {link.items && <span className="ml-2 text-xs text-gray-400">{link.items}</span>}
                  </span>
                </Link>
              ))}
              
              {user && (
                <Link href="/orders">
                  <span 
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer ${
                      router.pathname === '/orders'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 active:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl">📦</span>
                    <span className="text-lg">My Orders</span>
                  </span>
                </Link>
              )}
              
              <div className="border-t border-gray-800 my-3"></div>
              
              {user ? (
                <>
                  <div className="flex items-center gap-4 px-5 py-3 bg-gray-800/50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E94E24] to-red-500 rounded-xl flex items-center justify-center shadow-md">
                      <User size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.displayName || user.name || 'User'}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                    className="flex items-center gap-4 px-5 py-4 text-red-400 font-semibold hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <LogOut size={22} />
                    <span className="text-lg">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-3 px-2 pt-2">
                  <Link href="/login" className="flex-1">
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="w-full py-4 text-[#E94E24] font-bold border-2 border-[#E94E24]/30 rounded-2xl hover:bg-[#E94E24]/10 transition-all text-lg"
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="w-full py-4 bg-gradient-to-r from-[#E94E24] to-red-500 text-white font-bold rounded-2xl transition-all text-lg shadow-lg"
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
