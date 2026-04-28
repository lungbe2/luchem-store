import { useEffect } from 'react';
import Head from 'next/head';
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
      <Head>
        <title>LuChem | Premium Cleaning Solutions</title>
        <meta name="description" content="Shop LuChem cleaning detergents, raw materials, bottled water, and cleaning services in South Africa." />
        <meta name="theme-color" content="#071a33" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Component {...pageProps} />
      <Footer />
    </CartProvider>
  );
}

export default MyApp;
