import "react-native-gesture-handler";
import "@react-native-async-storage/async-storage";
import "./config/firebaseConfig";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { AuthProvider } from "./hooks/useAuth";
import { useAppUpdate } from "./hooks/useAppUpdate";

export default function App() {
  useAppUpdate();

  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
