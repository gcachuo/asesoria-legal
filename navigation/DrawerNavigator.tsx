import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../screens/LoginScreen";
import { useEffect, useState } from "react";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";

import { getAuth, onAuthStateChanged } from "firebase/auth/react-native";
import HomeStackNavigator from "./HomeStackNavigator";
import MyAccountScreen from "../screens/MyAccountScreen";
import ChatStackNavigator from "./ChatStackNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setIsLoggedIn(true);
        navigation.navigate("Home");
      } else {
        setIsLoggedIn(false);
        navigation.navigate("Login");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName={"Login"}
      screenOptions={{ headerTitle: "Asesoría Legal" }}
    >
      {!isLoggedIn && (
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          initialParams={{ isLoggedIn }}
        />
      )}
      {isLoggedIn && (
        <Drawer.Group>
          <Drawer.Screen
            name="Home"
            component={HomeStackNavigator}
            options={{ title: "Inicio" }}
          />
          <Drawer.Screen
            name="Chat"
            component={ChatStackNavigator}
            options={{ title: "Chat" }}
          />
          <Drawer.Screen
            name="MyAccount"
            component={MyAccountScreen}
            options={{ title: "Mi Cuenta" }}
          />
        </Drawer.Group>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
