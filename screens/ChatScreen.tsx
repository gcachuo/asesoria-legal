import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { Button } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";

function enviarMensaje(nombre: string, mensaje: string) {
  const mensajesRef = ref(getDatabase(), "mensajes");
  push(mensajesRef, { nombre, mensaje });
}

// Escuchar los nuevos mensajes en tiempo real
function escucharMensajes(callback: (nuevosMensajes: any) => void) {
  const mensajesRef = ref(getDatabase(), "mensajes");
  onValue(mensajesRef, (snapshot) => {
    const mensajes: any[] = [];
    snapshot.forEach((childSnapshot) => {
      const mensaje = childSnapshot.val();
      mensajes.push(mensaje);
    });
    callback(mensajes);
  });
}

function ChatScreen() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Escuchar los nuevos mensajes en tiempo real
    escucharMensajes((nuevosMensajes) => {
      setMensajes(nuevosMensajes);
    });
  }, []);

  function handleEnviarMensaje() {
    const nombre = user?.email;
    if (nombre && mensaje) {
      // Agregar el nuevo mensaje a Firebase
      enviarMensaje(nombre, mensaje);
      // Limpiar el campo de texto del mensaje
      setMensaje("");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Chat para Abogados</Text>
      <FlatList
        data={mensajes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.mensaje}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.texto}>{item.mensaje}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mensaje"
          value={mensaje}
          onChangeText={setMensaje}
        />
        <Button onPress={handleEnviarMensaje}>Enviar</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mensaje: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
    width: 300,
  },
  nombre: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  texto: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
