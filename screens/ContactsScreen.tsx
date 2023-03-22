import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query as queryStore,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { Avatar } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  endAt,
  getDatabase,
  onValue,
  orderByKey,
  query as queryDB,
  ref,
  startAt,
} from "firebase/database";
import BackButton from "../components/BackButton";

export default function ContactsScreen() {
  const { user } = useAuth();
  const [contactos, setContactos] = useState<any[]>([]);
  const [lawyerContacts, setLawyerContacts] = useState<any[]>([]);
  const navigation: StackNavigationProp<
    { ChatScreen: { contact: string } },
    "ChatScreen"
  > = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        const mensajesRef = ref(getDatabase(), "mensajes");
        onValue(
          queryDB(
            mensajesRef,
            orderByKey(),
            startAt(user.uid),
            endAt("\uf8ff")
          ),
          (snapshot) => {
            // Obtener los datos del snapshot
            const data = snapshot.val();

            // Hacer algo con los datos
            if (data) {
              const contacts = Object.keys(data)
                .filter((x) => x.includes(user.uid))
                .map((x) => x.split(user.uid + ":")[1]);
              setLawyerContacts(contacts);
            } else {
              setLawyerContacts([]);
            }
          }
        );
      }
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      const getUsers = async () => {
        if (user) {
          const userData = await getDoc(
            doc(getFirestore(), "users", user?.uid)
          );
          const chatsData = await getDoc(
            doc(getFirestore(), "chats", user?.uid)
          );

          const usersRef = queryStore(
            collection(getFirestore(), "users"),
            where("lawyer", "!=", userData.data()?.lawyer)
          );
          const snapshot: QuerySnapshot = await getDocs(usersRef);
          const data = snapshot.docs
            .map((doc, uid) => ({
              id: doc.id,
              name: doc.data().name,
              phoneNumber: doc.data().phoneNumber,
              photoURL: doc.data().photoURL,
            }))
            .filter((x) => x.id != userData.id)
            .filter(
              (x) => !userData.data()?.lawyer || lawyerContacts.includes(x.id)
            );
          setContactos(data);
        }
      };

      getUsers();
    }, [lawyerContacts])
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("ChatScreen", { contact: item.id })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 300,
        }}
      >
        <Avatar.Image
          source={{
            uri: item.photoURL || "https://picsum.photos/id/1005/200/200",
          }}
          size={50}
        />
        <Text style={styles.nombre}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BackButton />
        <Text style={styles.titulo}>Conversaciones</Text>
      </View>
      <FlatList
        data={contactos}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.titulo}>No hay conversaciones para mostrar.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    paddingRight: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 40,
  },
  telefono: {
    fontSize: 14,
    color: "#666",
  },
});
