import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CartProvider } from '../context/CartContext';
import Footer from '../components/Footer';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize auth session once
    supabase.auth.getSession();
  }, []);

  return (
    <CartProvider>
      <Component {...pageProps} />
      <Footer />
    </CartProvider>
  );
}

export default MyApp;
