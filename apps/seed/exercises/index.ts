/* eslint-disable */
// Looping over all the files in the directory ./list/*.json

import { Exercise } from "./types";
import * as fs from "fs";
import * as path from "path";
import translateJson from "./translateJson";

const exercises: Exercise[] = [];

const files = fs.readdirSync(path.join(import.meta.dir, "list"));
files.forEach((file) => {
  if (!file.endsWith(".json")) {
    return;
  }
  const exercise = require(`./list/${file}`);
  exercises.push(exercise);
});

exercises.forEach(async (exercise) => {
  // Does the transated file already exist?
  if (
    fs.existsSync(
      path.join(import.meta.dir, "translated", `${exercise.id}.json`),
    )
  ) {
    return;
  }

  console.log(`Translating ${exercise.id}`);
  console.log(`Translating ${exercise.name}`);

  // Translate the file
  const translated = await translateJson(JSON.stringify(exercise));
  const translatedExercise = JSON.parse(translated) as Exercise;

  // Replace the id with the original id
  translatedExercise.id = exercise.id;
  // Replace the images with the original images
  translatedExercise.images = exercise.images;

  // Save the translated file
  fs.writeFileSync(
    path.join(import.meta.dir, "translated", `${exercise.id}.json`),
    JSON.stringify(translatedExercise, null, 2),
  );
});
