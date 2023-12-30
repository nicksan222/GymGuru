import { useSignIn } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, Pressable } from "react-native";

const SignInWithEmail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useSignIn();

  const handleSignInPress = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    console.info("Signing in...");
    console.info("Email:", email);
    console.info("Password:", password);

    try {
      const result = await signIn?.create({ identifier: email, password });
      console.log(result);
      // Handle successful sign-in
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.log("Error signing in", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#aaa"
          textContentType="password"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? "#3366bb" : "#407bff" },
        ]}
        onPress={handleSignInPress}
      >
        <Text style={styles.buttonText}>Conferma</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 40,
  },
  containerInput: {
    width: "100%",
    marginBottom: 10,
    flex: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#407bff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignInWithEmail;
