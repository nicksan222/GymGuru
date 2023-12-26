import { inferRouterOutputs } from "@trpc/server";
import {
  WorkoutExercise,
  WorkoutPlan,
  WorkoutPlanDay,
} from "../../../../../packages/db";
import { AppRouter } from "@acme/api";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import WorkoutPreviewSingleExerciseBox from "./workoutPreviewSingleExerciseBox";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStackParamList";

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
  workoutDay: RouterOutput["plansRouter"]["getActivePlan"]["days"][0];
  navigation: NativeStackScreenProps<RootStackParamList, "Home">;
}

export default function WorkoutDayPreviewTile({
  workoutDay,
  navigation,
}: Props) {
  const mutation = trpc.progressRouter.startWorkout.useMutation();

  function startWorkout() {
    mutation.mutateAsync({
      workoutId: workoutDay.dayInfo.id,
    });
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      navigation.navigation.navigate("StartWorkout", {
        workoutId: workoutDay.dayInfo.id,
      });
    }
  }, [mutation.isSuccess]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giorno {workoutDay.dayInfo.day}</Text>
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {workoutDay.exercises.map((exercise) => {
          return (
            <WorkoutPreviewSingleExerciseBox
              key={exercise.exerciseInfo?.id}
              workoutExercise={exercise}
            />
          );
        })}
      </ScrollView>
      <Pressable style={styles.button} onPress={startWorkout}>
        <Text style={styles.buttonText}>Inizia workout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 200,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderColor: "#ddd",
    marginTop: 10,
  },
  scrollViewContent: {},
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#020202",
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});
