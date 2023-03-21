import React, { useEffect, useState } from "react";
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
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { Avatar } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function ContactsScreen() {
  const { user } = useAuth();
  const [contactos, setContactos] = useState<any[]>([]);
  const navigation: StackNavigationProp<
    { ChatScreen: { contact: string } },
    "ChatScreen"
  > = useNavigation();

  useEffect(() => {
    const getUsers = async () => {
      if (user) {
        const userData = await getDoc(doc(getFirestore(), "users", user?.uid));
        const chatsData = await getDoc(doc(getFirestore(), "chats", user?.uid));

        const usersRef = query(
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
            (x) => !userData.data()?.lawyer || chatsData.data()?.chats[x.id]
          );
        setContactos(data);
      }
    };

    getUsers();
  }, []);

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
      <FlatList
        data={contactos}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
