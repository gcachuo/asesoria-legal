import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import Grid from "../components/Grid";
import { getAuth, signOut } from "firebase/auth/react-native";
import manifest from "../app.json";

export default function HomeScreen() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={{ opacity: 0.2 }}>v{manifest.expo.version}</Text>
      <Grid
        tiles={[
          {
            title: "Chat",
            icon: "message",
            onPress: () => navigation.navigate("Chat"),
          },
          {
            title: "Calendario",
            icon: "calendar",
            onPress: () => navigation.navigate("Calendar"),
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
