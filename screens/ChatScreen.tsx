import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { User } from "firebase/auth/react-native";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import {
  equalTo,
  getDatabase,
  onValue,
  orderByChild,
  push,
  query,
  ref,
} from "firebase/database";
import { doc, getDoc, getFirestore } from "firebase/firestore";

function enviarMensaje(user: User | null, recipient: string, mensaje: string) {
  const mensajesRef = ref(getDatabase(), "mensajes");
  push(mensajesRef, {
    text: mensaje,
    senderId: user?.uid,
    senderName: user?.displayName,
    recipient: recipient,
    timestamp: Date.now(),
  });
}

// Escuchar los nuevos mensajes en tiempo real
function escucharMensajes(
  recipient: string,
  callback: (nuevosMensajes: any) => void
) {
  const mensajesRef = ref(getDatabase(), "mensajes");
  const mensajesQuery = query(
    mensajesRef,
    orderByChild("recipient"),
    equalTo(recipient)
  );
  const mensajesQuery2 = query(
    mensajesRef,
    orderByChild("senderId"),
    equalTo(recipient)
  );
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
  const [recipient, setRecipient] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const flatListRef = useRef<FlatList>(null);
  const route = useRoute<RouteProp<{ params: { contact: string } }>>();

  const { user } = useAuth();

  const scrollToBottom = () => {
    if (flatListRef.current && mensajes.length > 0) {
      flatListRef.current.scrollToEnd();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setRecipient(route.params.contact);
      getDoc(doc(getFirestore(), "users", route.params.contact)).then(
        (value) => {
          // Escuchar los nuevos mensajes en tiempo real
          escucharMensajes(value.id, (nuevosMensajes) => {
            setMensajes(nuevosMensajes);
          });
        }
      );
    }, [route.params.contact])
  );

  function handleEnviarMensaje() {
    if (mensaje) {
      // Agregar el nuevo mensaje a Firebase
      enviarMensaje(user, recipient, mensaje);
      // Limpiar el campo de texto del mensaje
      setMensaje("");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Chat para Abogados</Text>
      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => <Text>No hay mensajes para mostrar.</Text>}
        onContentSizeChange={scrollToBottom}
        renderItem={({
          item,
        }: {
          index: number;
          item: { text: string; senderName: string };
        }) => {
          return (
            <View style={styles.mensaje}>
              <Text style={styles.nombre}>{item.senderName}</Text>
              <Text style={styles.texto}>{item.text}</Text>
            </View>
          );
        }}
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
    paddingBottom: 20,
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
