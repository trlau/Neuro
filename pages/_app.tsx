import "../styles/globals.css";
import { useEffect, createContext } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import Auth from "../components/Auth";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../components/ThemeProvider";
import { LoadingPage } from "../components/Loading";
import { AuthProvider } from "../route/AuthContext";
import { ProtectedRoute } from "../route/ProtectedRoute";
import AdminPage from "./admin";



export default function MyApp({ Component, pageProps }: AppProps) {


  const [user, loading] = useAuthState(auth);
  const router = useRouter();


  useEffect(() => {
    if (!loading && !user && (router.pathname == "/login")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <AuthProvider>
      <ThemeProvider>
        {loading ? (
          <LoadingPage></LoadingPage>
        ) : !user ? (
          <Auth />
        )
          : router.pathname == "/admin" ? (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage></AdminPage>
            </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
