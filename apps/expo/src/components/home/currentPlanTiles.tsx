import { Text, View, StyleSheet } from "react-native";
import { trpc } from "../../utils/trpc";
import WorkoutDayPreviewTile from "./workoutPreviewTile";

export default function CurrentPlanTile() {
  const currentPlan = trpc.plansRouter.getActivePlan.useQuery();

  if (currentPlan.error || !currentPlan.data) {
    return (
      <View style={styles.containerNoPlan}>
        <Text style={styles.textNoPlan}>Nessun piano attivo attualmente</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {currentPlan.data.plan?.startDate.toLocaleDateString("it-IT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        -{" "}
        {currentPlan.data.plan?.endDate.toLocaleDateString("it-IT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
      {currentPlan.data.plan?.WorkoutPlanDay.map((day) => {
        return <WorkoutDayPreviewTile key={day.id} workoutDay={day} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    overflow: "scroll",
    borderRadius: 10,
    backgroundColor: "#fdfdfd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  containerNoPlan: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  textNoPlan: {
    fontSize: 16,
    fontWeight: "500",
    color: "@bbb",
    textAlign: "left",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
