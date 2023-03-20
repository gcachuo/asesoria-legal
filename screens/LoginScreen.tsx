import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  AuthError,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth/react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>(null as unknown as string);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const route =
    useRoute<RouteProp<{ Login: { isLoggedIn: boolean } }, "Login">>();
  const isLoggedIn = route.params?.isLoggedIn;

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("Home");
    }
  }, [isLoggedIn]);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(getAuth(), email, password).catch((error) =>
      handleErrors(error)
    );
  };

  const handleLogin = () => {
    setError("");

    if (!email) {
      return;
    }

    signInWithEmailAndPassword(getAuth(), email, password).catch(
      (error: AuthError) => handleErrors(error)
    );
  };

  const handleResetPassword = () => {
    setError("");

    sendPasswordResetEmail(getAuth(), email)
      .then(() => {
        Alert.alert(
          "Correo electrónico enviado",
          "Revisa tu correo electrónico para restablecer tu contraseña."
        );
      })
      .catch((error) => handleErrors(error));
  };

  const handleErrors = (error: AuthError) => {
    switch (error.code) {
      case "auth/missing-email":
        setError("Por favor ingrese su correo.");
        break;
      case "auth/too-many-requests":
        setError(
          "El acceso a esta cuenta ha sido temporalmente desactivado debido a múltiples intentos fallidos de inicio de sesión. Puede restaurarlo de inmediato restableciendo su contraseña o puede intentarlo de nuevo más tarde."
        );
        break;
      case "auth/invalid-email":
        setError("El correo no esta en el formato correcto");
        break;
      case "auth/wrong-password":
        setError("Los datos ingresados no son correctos");
        break;
      case "auth/email-already-in-use":
        setError(
          "Esta cuenta ya esta registrada, intente iniciar sesión con su contraseña."
        );
        break;
      case "auth/weak-password":
        setError("La contraseña debe ser de al menos 6 caracteres");
        break;
      case "auth/internal-error":
      default:
        if (!password) {
          setError("Por favor ingrese su contraseña");
          return;
        }
        setError(error.message);
        break;
    }
  };

  return (
    <View style={{ marginHorizontal: 60 }}>
      {isLoggedIn ? (
        <View style={{ alignItems: "center" }}>
          <Text>You are logged in!</Text>
        </View>
      ) : (
        <>
          <Appbar.Header style={{ backgroundColor: "transparent" }}>
            <Appbar.Content title="Asesoría Legal" />
          </Appbar.Header>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.TextInput}
            keyboardType={"email-address"}
            textContentType={"emailAddress"}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.TextInput}
          />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <Button onPress={handleLogin}>Inicia Sesión</Button>
          <Button onPress={handleResetPassword}>Olvide mi contraseña</Button>
          {false && <Button onPress={handleSignUp}>Registrate</Button>}
        </>
      )}
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  TextInput: { marginBottom: 15 },
});
