import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { User } from "firebase/auth/react-native";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import BackButton from "../components/BackButton";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;

function enviarMensaje(
  chat: string,
  user: User | null,
  recipient: string,
  mensaje: string
) {
  const mensajesRef = ref(getDatabase(), "mensajes/" + chat);
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
  chat: string,
  recipient: string,
  callback: (nuevosMensajes: any) => void
) {
  const mensajesRef = ref(getDatabase(), "mensajes/" + chat);
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
  const [chat, setChat] = useState("");
  const [recipient, setRecipient] = useState<DocumentData>({});
  const [recipientId, setRecipientId] = useState<string>("");
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
      getDoc(doc(getFirestore(), "users", route.params.contact)).then(
        async (value) => {
          setRecipientId(value.id);
          setRecipient(value.data()!);

          const data = await getDoc(doc(getFirestore(), "chats", user!.uid));
          if (!data.data()) {
            await setDoc(
              doc(getFirestore(), "chats", user!.uid),
              {
                chats: {
                  [route.params.contact]: {
                    name: `${route.params.contact}:${user?.uid}`,
                    recipient: route.params.contact,
                  },
                },
              },
              { merge: true }
            );
            await setDoc(
              doc(getFirestore(), "chats", route.params.contact),
              {
                chats: {
                  [user!.uid]: {
                    name: `${route.params.contact}:${user?.uid}`,
                    recipient: user?.uid,
                  },
                },
              },
              { merge: true }
            );
          }
          const chat = data.data()?.chats[route.params.contact].name;
          setChat(chat);

          // Escuchar los nuevos mensajes en tiempo real
          escucharMensajes(chat, value.id, (nuevosMensajes) => {
            setMensajes(nuevosMensajes);
          });
        }
      );
    }, [route.params.contact])
  );

  function handleEnviarMensaje() {
    if (mensaje) {
      // Agregar el nuevo mensaje a Firebase
      enviarMensaje(chat, user, recipientId, mensaje);
      // Limpiar el campo de texto del mensaje
      setMensaje("");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BackButton />
        <Text style={styles.titulo}>{recipient.name}</Text>
      </View>
      <View style={styles.container}>
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
    fontSize: 20,
    fontWeight: "bold",
    paddingRight: 30,
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
