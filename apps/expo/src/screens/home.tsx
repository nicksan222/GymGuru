import React from "react";

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentPlanTile from "../components/home/currentPlanTiles";

export const HomeScreen = () => {
  return (
    <SafeAreaView className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="h-full w-full p-4">
        <Text className="ml-2 pb-2 text-3xl font-bold text-black">
          I tuoi piani
        </Text>
        <CurrentPlanTile />
      </View>
    </SafeAreaView>
  );
};
