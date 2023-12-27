import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStackParamList";

type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "StartWorkout"
>;

export default function StartWorkout({ route }: DetailsScreenProps) {
  const { workoutId } = route.params;

  return <View></View>;
}
