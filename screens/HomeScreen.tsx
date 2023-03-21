import React from "react";
import { StyleSheet, View } from "react-native";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import Grid from "../components/Grid";
import { getAuth, signOut } from "firebase/auth/react-native";

export default function HomeScreen() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  return (
    <View style={styles.container}>
      <Grid
        tiles={[
          {
            title: "Chat",
            icon: "message",
            onPress: () => navigation.navigate("Chat"),
          },
          {
            title: "Mi Cuenta",
            icon: "account",
            onPress: () => navigation.navigate("MyAccount"),
          },
          {
            title: "Salir",
            icon: "logout",
            onPress: async () => {
              await signOut(getAuth());
            },
          },
        ]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});
