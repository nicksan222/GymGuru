import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";

import { HomeScreen } from "./screens/home";
import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import Constants from "expo-constants";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartWorkout from "./screens/workout/start";
import { RootStackParamList } from "./types/rootStackParamList";
const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="StartWorkout" component={StartWorkout} />
              </Stack.Navigator>
            </NavigationContainer>
            <StatusBar />
          </SafeAreaProvider>
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <SignInSignUpScreen />
      </SignedOut>
    </ClerkProvider>
  );
};
