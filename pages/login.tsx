import Auth from "../components/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
    useEffect(() => {
      if (user) {
        router.push("/chat");
      }
    }, [user, loading, router]);
  return <Auth />;
}