import { AppRouter } from "@acme/api";
import { inferRouterOutputs } from "@trpc/server";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { RootStackParamList } from "../../types/rootStackParamList";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
  workoutExercise: RouterOutput["plansRouter"]["getActivePlan"]["plan"]["WorkoutPlanDay"][0]["WorkoutExercise"][0];
}

export default function WorkoutPreviewSingleExerciseBox({
  workoutExercise,
}: Props) {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            workoutExercise.Exercise?.imageUrl ||
            "https://via.placeholder.com/75",
        }}
        style={{ width: 75, height: 75 }}
      />
      <Text style={styles.title}>{workoutExercise.Exercise?.name}</Text>
      <Text style={styles.description}>
        {workoutExercise.WorkoutSet.length} serie
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: "auto",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  description: {
    fontSize: 12,
    color: "#000",
  },
});
