import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Coffee, Flame, Star, Clock, ShieldCheck, Zap, ChevronRight, Sparkles, ArrowRight, Heart } from 'lucide-react';
import ReviewList from '../components/Review/ReviewList';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    {
      name: 'Beverages',
      href: '/beverages',
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      bgGradient: 'from-cyan-50 to-blue-100',
      emoji: '☕',
      description: 'Refreshing drinks & creamy shakes',
      
    },
    {
      name: 'Desserts',
      href: '/desserts',
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      bgGradient: 'from-pink-50 to-rose-100',
      emoji: '🍰',
      description: 'Sweet treats & indulgent cakes',
      
    },
    {
      name: 'Loaded Fries',
      href: '/loaded-fries',
      gradient: 'from-[#E94E24] via-red-500 to-rose-600',
      bgGradient: 'from-[#E94E24]/10 to-red-100',
      emoji: '🍟',
      description: 'Crispy fries loaded to perfection',
      
    }
  ];

  const features = [
    { icon: <Clock size={28} />, title: 'Lightning Fast', desc: '15-20 min delivery', color: 'from-blue-500 to-cyan-500' },
    { icon: <Star size={28} />, title: 'Premium Quality', desc: 'Fresh ingredients daily', color: 'from-[#E94E24] to-[#E94E24]' },
    { icon: <ShieldCheck size={28} />, title: 'Secure Payments', desc: 'UPI & Cash accepted', color: 'from-green-500 to-emerald-500' },
    { icon: <Zap size={28} />, title: 'Hot & Fresh', desc: 'Made when you order', color: 'from-[#E94E24] to-red-500' }
  ];

  return (
    <div className="min-h-screen">
      <div className="space-y-0">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              style={{ opacity: 0.35 }}
            >
              <source src="https://videos.pexels.com/video-files/3454494/3454494-sd_640_360_30fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80"></div>
          </div>
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#E94E24]/20 rounded-full blur-[120px] animate-pulse-glow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className={`space-y-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
                <div className="inline-flex items-center gap-2 bg-[#E94E24]/20 border border-[#E94E24]/30 px-4 py-2 rounded-full">
                  <Flame size={16} className="text-[#E94E24]" />
                  <span className="text-sm font-bold text-[#ff6b4a]">#1 Loaded Fries in Town</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="text-white">Crispy Fries,</span>
                  <br />
                  <span className="gradient-text text-shadow">Loaded Dreams</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                  Experience the ultimate loaded fries crafted with premium ingredients, bold flavors, and delivered fresh to your doorstep in minutes! 🍟
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/loaded-fries">
                    <button className="group btn-primary px-8 py-4 text-lg flex items-center gap-3">
                      <span>Order Now</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Content - Hero Image */}
              <div className={`relative z-10 ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E94E24] to-red-500 rounded-[3rem] blur-3xl opacity-30 animate-pulse-glow"></div>
                  
                  {/* Main hero card */}
                  <div className="relative glass-card rounded-[3rem] p-8 lg:p-12">
                    <div className="text-center">
                      <div className="text-[10rem] lg:text-[14rem] animate-float drop-shadow-2xl">
                        🍟
                      </div>
                      <div className="mt-4 space-y-2">
                        <h3 className="text-3xl font-black text-white">Signature Loaded Fries (99)</h3>
                        <p className="text-gray-400">Starting from</p>
                        <p className="text-5xl font-black gradient-text">₹99</p>
                      </div>
                    </div>

                    {/* Highlight badges */}
                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                      <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 px-4 py-2 rounded-full">
                        <span className="text-sm font-bold text-pink-300">🍪 Signature Marshmello Cookie</span>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-2 rounded-full">
                        <span className="text-sm font-bold text-green-300">🍹 Mojito</span>
                      </div>
                      <div className="bg-gradient-to-r from-[#E94E24]/20 to-red-600/20 border border-[#E94E24]/30 px-4 py-2 rounded-full">
                        <span className="text-sm font-bold text-[#ff6b4a]">🌶️ Trending</span>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 -left-4 bg-gray-900 shadow-xl px-4 py-2 rounded-2xl font-bold flex items-center gap-2 animate-bounce-subtle border border-gray-800" style={{animationDelay: '0.5s'}}>
                      <Heart size={18} className="text-red-500 fill-red-500" />
                      <span className="text-gray-200">2.3k loves</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`glass-card rounded-3xl p-6 lg:p-8 text-center group hover:-translate-y-2 transition-all duration-500 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                  style={{animationDelay: `${0.4 + index * 0.1}s`}}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-white mb-1 text-lg">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-[#E94E24]/20 text-[#E94E24] font-bold rounded-full text-sm mb-4 border border-[#E94E24]/30">
                🍽️ OUR MENU
              </span>
              <h2 className="text-4xl lg:text-6xl font-black mb-4">
                <span className="text-white">Explore </span>
                <span className="gradient-text">Deliciousness</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Choose from our carefully crafted categories, each packed with flavors that'll make your taste buds dance!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link key={category.name} href={category.href}>
                  <div 
                    className={`group relative cursor-pointer ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                    style={{animationDelay: `${0.8 + index * 0.15}s`}}
                  >
                    {/* Background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
                    
                    <div className={`relative bg-gray-900/80 rounded-[2rem] p-8 border border-gray-800 overflow-hidden transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:border-[#E94E24]/30`}>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative z-10">
                        <div className="text-8xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
                          {category.emoji}
                        </div>
                        
                        {/* badge removed per request */}
                        
                        <h3 className="text-2xl font-black text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 mb-6">
                          {category.description}
                        </p>
                        
                        <div className={`inline-flex items-center gap-2 text-transparent bg-gradient-to-r ${category.gradient} bg-clip-text font-bold group-hover:gap-4 transition-all`}>
                          <span>Explore Menu</span>
                          <ChevronRight size={20} className="text-[#E94E24] group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-[#E94E24]/20 text-[#E94E24] font-bold rounded-full text-sm mb-4 border border-[#E94E24]/30">
                ⭐ REVIEWS
              </span>
              <h2 className="text-4xl lg:text-5xl font-black">
                <span className="text-white">What Our </span>
                <span className="gradient-text">Foodies Say</span>
              </h2>
            </div>

            <ReviewList maxItems={6} />

            <div className="text-center mt-8">
              <Link href="/reviews">
                <button className="btn-secondary px-8 py-3 text-lg flex items-center gap-2 mx-auto">
                  <Star size={18} />
                  View All Reviews & Leave Yours
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#E94E24] via-red-500 to-[#E94E24] rounded-[3rem] blur-3xl opacity-30"></div>
              
              <div className="relative bg-gradient-to-br from-[#E94E24] via-red-500 to-red-600 rounded-[3rem] p-12 lg:p-16 text-center text-white overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 text-8xl">🍟</div>
                  <div className="absolute bottom-10 right-10 text-8xl">🍔</div>
                  <div className="absolute top-1/2 left-1/4 text-6xl">☕</div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 animate-bounce-subtle">🚀</div>
                  <h2 className="text-4xl lg:text-5xl font-black mb-4">Ready to Feast?</h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Join thousands of happy foodies! Order now and experience the best loaded fries in town.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/loaded-fries">
                      <button className="bg-white text-red-600 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3">
                        <Sparkles size={22} />
                        Order Now
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300">
                        Create Account
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}