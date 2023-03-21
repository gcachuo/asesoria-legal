import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSoJVjzM93gV88pys5BDVHH0YRSBo9EBM",
  authDomain: "asesoria-legal-c203c.firebaseapp.com",
  projectId: "asesoria-legal-c203c",
  storageBucket: "asesoria-legal-c203c.appspot.com",
  messagingSenderId: "163327203866",
  appId: "1:163327203866:web:7196167e585535bf60cfa3",
  measurementId: "G-BC7SNDX5JG",
};

let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.warn("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}
