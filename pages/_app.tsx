import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import Auth from "../components/Auth";
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Auth />;

  return <Component {...pageProps} />;
}

export default MyApp;
