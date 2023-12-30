import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@acme/api";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import WorkoutPreviewSingleExerciseBox from "./workoutPreviewSingleExerciseBox";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStackParamList";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { conflictError } from "@acme/api/src/router/workouts/start-workout-types";

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
  workoutDay: RouterOutput["plansRouter"]["getActivePlan"]["plan"]["WorkoutPlanDay"][0];
}

export default function WorkoutDayPreviewTile({ workoutDay }: Props) {
  const mutationStartWorkout = trpc.workoutsRouter.startWorkout.useMutation();
  const mutationEndWorkout = trpc.workoutsRouter.endWorkout.useMutation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  function startWorkout() {
    if (!workoutDay) return;

    mutationStartWorkout.mutate({
      workoutId: workoutDay?.id,
    });
  }

  function continuePreviousWorkout() {
    // Navigate to the workout screen
  }

  async function stopPreviousWorkoutAndStartNew() {
    try {
      const result = await mutationEndWorkout.mutateAsync({
        workoutPlanDayId: workoutDay?.id,
      });

      if (result) {
        // Now i can start the workout
        startWorkout();
      }
    } catch (error) {
      Alert.alert("Errore", "Impossibile terminare il workout in corso");
    }
  }

  useEffect(() => {
    if (mutationStartWorkout.isSuccess && workoutDay) {
      navigation.navigate("StartWorkout", {
        workoutId: workoutDay?.id,
      });
    } else if (mutationStartWorkout.isError) {
      // Is another workout running?
      if (mutationStartWorkout.error.message === conflictError.message) {
        Alert.alert("Attenzione", "E' stato trovato un workout in corso", [
          {
            text: "Continua precedente",
            style: "default",
            onPress: () => continuePreviousWorkout(),
          },
          {
            text: "Termina e inizia nuovo",
            style: "destructive",
            onPress: () => stopPreviousWorkoutAndStartNew(),
          },
          {
            text: "Annulla",
            style: "cancel",
          },
        ]);
      }
    }
  }, [mutationStartWorkout.isSuccess, mutationStartWorkout.isError]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giorno {workoutDay.day}</Text>
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {workoutDay.WorkoutExercise.map((exercise) => {
          return (
            <WorkoutPreviewSingleExerciseBox
              key={exercise.id}
              workoutExercise={exercise}
            />
          );
        })}
      </ScrollView>
      <Pressable
        style={styles.button}
        onPress={startWorkout}
        disabled={mutationStartWorkout.isLoading}
      >
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
