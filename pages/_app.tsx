import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import Auth from "../components/Auth";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../components/ThemeProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <ThemeProvider>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      ) : !user ? (
        <Auth />
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}
