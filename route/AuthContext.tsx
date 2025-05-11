
import { createContext, useContext } from "react";

const userData = {
  "role": ""
}

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthContext = createContext(userData);

export function AuthProvider({children} : any) {
    return (
        <AuthContext.Provider value={userData}>
            {children}
        </AuthContext.Provider>
    )
}