import React from "react";

import { View, SafeAreaView } from "react-native";

import SignInWithEmail from "../components/signin/SignInWithEmail";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="h-full w-full p-4">
        <SignInWithEmail />
      </View>
    </SafeAreaView>
  );
};
