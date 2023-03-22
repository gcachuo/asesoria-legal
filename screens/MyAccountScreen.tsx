import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Caption,
  IconButton,
  Modal,
  TextInput,
  Title,
} from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "firebase/auth/react-native";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { launchCameraAsync } from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";

export default function MyAccountScreen() {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLawyer, setLawyerStatus] = useState(false);
  const [editedData, setEditedData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    photoURL: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    (async () => {
      if (user) {
        const data = await getDoc(doc(getFirestore(), "users", user.uid));
        setPhoneNumber(data.data()?.phoneNumber);
        setLawyerStatus(data.data()?.lawyer);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    try {
      if (user) {
        console.log("Start saving user");

        await updateProfile(user, editedData);
        await setDoc(doc(getFirestore(), "users", user.uid), {
          name: user.displayName,
          phoneNumber: editedData.phoneNumber,
          photoURL: editedData.photoURL,
          lawyer: isLawyer,
        });
        setPhoneNumber(editedData.phoneNumber);

        console.log("Finish save");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const chooseImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos de cámara para tomar fotos");
    }

    const result = await launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImage(result.assets.at(0)?.uri);
      setEditedData({ ...editedData, photoURL: imageUrl || "" });
    }
  };

  const uploadImage = async (uri: any) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(getStorage(), "images/" + uuidv4());

      await uploadBytes(imageRef, blob);
      console.log("Uploaded a blob or file!");

      return await getDownloadURL(imageRef);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.warn(e.code);
      }
      console.warn(e);
    }
  };

  return (
    <View>
      <Appbar
        style={{
          justifyContent: "space-between",
          backgroundColor: "transparent",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setEditedData({
              displayName: user?.displayName || "",
              email: user?.email || "",
              phoneNumber: phoneNumber || "",
              photoURL: user?.photoURL || "",
            });
            setIsModalVisible(true);
          }}
        >
          <View>
            <IconButton icon="pencil" size={20} />
          </View>
        </TouchableWithoutFeedback>
      </Appbar>
      <View style={styles.container}>
        <Avatar.Image
          source={{
            uri: user?.photoURL || "https://picsum.photos/id/1005/200/200",
          }}
          size={100}
          style={styles.avatar}
        />
        <Title style={styles.title}>
          {user?.displayName || "<Sin Nombre>"}
        </Title>
        <Caption style={styles.caption}>{user?.email || ""}</Caption>
        <Caption style={styles.caption}>
          {phoneNumber || "<Sin Teléfono>"}
        </Caption>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View
              style={{
                justifyContent: "space-around",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar.Image
                source={{
                  uri:
                    editedData?.photoURL ||
                    "https://picsum.photos/id/1005/200/200",
                }}
                size={100}
                style={styles.avatar}
              />
              <Button onPress={chooseImage}>Tomar foto</Button>
            </View>

            <TextInput
              label="Nombre Completo"
              value={editedData.displayName}
              onChangeText={(text) =>
                setEditedData({ ...editedData, displayName: text })
              }
            />
            <TextInput
              label="Email"
              value={editedData.email}
              onChangeText={(text) =>
                setEditedData({ ...editedData, email: text })
              }
            />
            <TextInput
              label="Teléfono"
              value={editedData.phoneNumber}
              onChangeText={(text) => {
                setEditedData({ ...editedData, phoneNumber: text });
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <Button onPress={() => setIsModalVisible(false)}>Cancelar</Button>
              <Button
                onPress={async () => {
                  // Lógica para guardar los datos editados
                  await handleSave();
                  setIsModalVisible(false);
                }}
              >
                Guardar
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 16,
    lineHeight: 16,
    marginBottom: 10,
    minWidth: 150,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  textInput: {
    marginVertical: 8,
  },
});
