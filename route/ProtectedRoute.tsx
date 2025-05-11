import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Unauthorized } from "../pages/unauthorized";
import { getUserRole } from "../components/chat/utils/firebaseUtils";

export function ProtectedRoute({ children, allowedRoles } : any) {
  // Important: Use consistent initial render between server and client
  const [isClient, setIsClient] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useAuth();

  // This effect only runs once after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  // This effect handles authorization check only on the client side
  useEffect(() => {
    if (!isClient) return;

    const checkAuthorization = async () => {
      let role = authContext.role;
      
      if (!role) {
        role = await getUserRole();
        // Update the context if needed
        authContext.role = role;
      }
      
      setIsAuthorized(allowedRoles.includes(role));
      setIsLoading(false);
    };
    
    checkAuthorization();
  }, [isClient, allowedRoles, authContext]);

  return isAuthorized ? children : isLoading? <div className="flex h-screen items-center justify-center">Getting user role...</div> : <Unauthorized />;
}