import { protectedProcedure } from "../../trpc";

const listExerciseCategories = protectedProcedure.query(async ({}) => {
  return [
    "Esercizi con resistenza",
    "Esercizi con il peso del corpo",
    "Esercizi di coordinazione",
    "Esercizi di stretching",
    "Esercizi di riscaldamento",
    "Esercizi di rafforzamento",
    "Esercizi di mobilità",
    "Esercizi di stabilizzazione",
    "Esercizi di potenziamento",
    "Esercizi di compensazione",
    "Esercizi di equilibrio",
    "Esercizi di allungamento",
  ];
});

export default listExerciseCategories;
