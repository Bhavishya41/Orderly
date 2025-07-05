import './../app/globals.css';
import { CartProvider } from "./../contexts/cartContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
