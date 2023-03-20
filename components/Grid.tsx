import React from "react";
import { FlatList, StyleSheet } from "react-native";
import Tile, { TileIcon } from "./Tile";

const Grid = ({
  tiles,
}: {
  tiles: { title: string; icon: TileIcon; onPress: () => void }[];
}) => {
  return (
    <FlatList
      data={tiles}
      numColumns={2}
      keyExtractor={(item) => item.title}
      renderItem={renderItem}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

const renderItem = ({
  item,
}: {
  item: {
    title: string;
    icon: TileIcon;
    onPress: () => void;
  };
}) => {
  return <Tile title={item.title} icon={item.icon} onPress={item.onPress} />;
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
});

export default Grid;
