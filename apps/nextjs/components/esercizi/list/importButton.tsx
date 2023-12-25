import React, { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { trpc } from "#/src/utils/trpc";
import { useToast } from "#/components/ui/use-toast";
import { Exercise } from "@acme/db";

export default function ImportEserciziButton() {
  const [exercises, setExercises] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const mutation = trpc.exercisesRouter.createExercise.useMutation();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("File read error");

          const parsedExercises = JSON.parse(data.toString());
          setExercises(parsedExercises); // Store the exercises in state
        } catch (parseError) {
          toast({
            title: "Errore di lettura",
            description: "Il file non è nel formato JSON valido",
            color: "red",
          });
        }
      };
      reader.onerror = () => {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la lettura del file",
          color: "red",
        });
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore imprevisto",
        color: "red",
      });
    }
  };

  const handleImport = () => {
    if (exercises.length === 0) {
      toast({
        title: "Nessun esercizio",
        description: "Nessun esercizio da importare",
        color: "orange",
      });
      return;
    }

    setIsImporting(true);
    exercises.forEach((exercise: Exercise, index: number) => {
      mutation.mutate(
        {
          ...exercise,
          secondaryMuscles: exercise.secondaryMuscles.split(",") ?? [],
          videoUrl: exercise.videoUrl ?? "",
          description: exercise.description ?? "",
          imageUrl: exercise.imageUrl?.split(",") ?? [],
        },
        {
          onSuccess: () => {
            if (index === exercises.length - 1) {
              setIsImporting(false);
              toast({
                title: "Importazione completata",
                description:
                  "Tutti gli esercizi sono stati importati con successo",
                color: "green",
              });
            }
          },
          onError: (error) => {
            setIsImporting(false);
            toast({
              title: "Errore durante l'importazione",
              description:
                error.message ||
                "Errore durante l'importazione di un esercizio",
              color: "red",
            });
          },
        },
      );
    });
  };

  return (
    <div className="mt-8">
      <Input type="file" onChange={handleFileChange} disabled={isImporting} />
      <Button
        onClick={handleImport}
        className="mt-4"
        disabled={isImporting || exercises.length === 0}
      >
        {isImporting ? "Importazione in corso..." : "Importa Esercizi"}
      </Button>
    </div>
  );
}
