import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type TileIcon = "logout" | "account" | "qrcode";

type Props = {
  title: string;
  icon: TileIcon;
  onPress: () => void;
};

const Tile: React.FC<Props> = ({ title, icon, onPress }) => {
  return (
    <TouchableRipple onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name={icon} size={48} color="#6200ee" />
        </View>
        <Title style={styles.title}>{title}</Title>
      </Card>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 110,
    textAlign: "center",
    justifyContent: "center",
    alignItems:'center'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    minWidth: 140,
    minHeight: 140,
  },
  title: {
    marginLeft: 16,
    fontSize: 12,
    textAlign: "center",
  },
});

export default Tile;
