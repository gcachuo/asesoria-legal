import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth/react-native";

type AuthContextProps = {
  user: User | null;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoggedIn: false,
});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), async (userAuth) => {
      try {
        if (userAuth) {
          setUser(userAuth);
          await AsyncStorage.setItem("user", JSON.stringify(userAuth));
        } else {
          setUser(null);
          await AsyncStorage.removeItem("user");
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
