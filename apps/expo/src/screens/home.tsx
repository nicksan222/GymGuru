import React from "react";

import { Text, View, StyleSheet, ScrollView } from "react-native";
import CurrentPlanTile from "../components/home/currentPlanTiles";

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.view}>
      <Text style={styles.title}>Bentornato</Text>
      <View>
        <CurrentPlanTile />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  innerView: {},
  title: {
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 32,
  },
});
