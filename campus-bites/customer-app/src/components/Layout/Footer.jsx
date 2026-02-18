import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white pt-10 sm:pt-16 pb-6 sm:pb-8 mt-10 sm:mt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E94E24] via-red-600 to-[#E94E24]"></div>
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#E94E24]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Lock N Load" className="w-12 h-12 object-cover rounded-xl" />
              <span className="text-xl sm:text-2xl font-black gradient-text">Lock N Load</span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Serving the crispiest, most loaded fries in town! Fresh ingredients, bold flavors, and quick delivery to satisfy your cravings.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/lock_n_load___?igsh=M3Jzb3N6ZmFrd2I2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E94E24] transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E94E24] transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E94E24] transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#E94E24]">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/loaded-fries" className="block text-gray-400 hover:text-white transition-colors">🍟 Loaded Fries</Link>
              <Link href="/desserts" className="block text-gray-400 hover:text-white transition-colors">🍰 Desserts</Link>
              <Link href="/beverages" className="block text-gray-400 hover:text-white transition-colors">☕ Beverages</Link>
              <Link href="/cart" className="block text-gray-400 hover:text-white transition-colors">🛒 Cart</Link>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#E94E24]">Contact Us</h4>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} className="text-[#E94E24]" />
                Open Air Theatre
              </p>
              <p className="flex items-center gap-2 text-gray-400">
                <Phone size={18} className="text-[#E94E24]" />
                +91 95978 55779
              </p>
              <p className="flex items-center gap-2 text-gray-400">
                <Mail size={18} className="text-[#E94E24]" />
                linkeshraj2470070@ssn.edu.in
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Lock and Load Fries. Made with 🔥 and lots of fries.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
