import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import Auth from "../components/Auth";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../components/ThemeProvider";
import { LoadingPage } from "../components/Loading";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  

  useEffect(() => {
    if (!loading && !user && (router.pathname == "/login")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <ThemeProvider>
      {loading ? (
        <LoadingPage></LoadingPage>
      ) : !user ? (
        <Auth />
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}
