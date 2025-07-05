import "./../app/globals.css"; // Adjust the path if your CSS is elsewhere
import { AuthProvider } from './../context/AuthContext'; // Adjust path if needed

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
