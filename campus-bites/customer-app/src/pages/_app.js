import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import BottomNav from '../components/Layout/BottomNav';
import MobileTopNav from '../components/Layout/MobileTopNav';
import BackgroundVideo from '../components/Layout/BackgroundVideo';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <BackgroundVideo />
        <Navbar />
        <MobileTopNav />
        <Component {...pageProps} />
        <Footer />
        <BottomNav />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
