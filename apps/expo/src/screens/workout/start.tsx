import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStackParamList";
import { trpc } from "../../utils/trpc";

type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "StartWorkout"
>;

export default function StartWorkout({
  route,
  navigation,
}: DetailsScreenProps) {
  const { workoutId } = route.params;

  return <View></View>;
}
