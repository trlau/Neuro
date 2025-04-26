import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import Auth from "../components/Auth";
import type { AppProps } from "next/app";
import Chat from "../components/Chat";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      if (!user) {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );

  if (!user) return <Auth />;

  return <Component {...pageProps} />;
}