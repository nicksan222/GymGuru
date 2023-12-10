import * as fs from "fs";
import * as path from "path";
import { put, list, del } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { ExerciseLocal } from "./types";
import {} from "";

const uploadedImages = await list({
  prefix: "exercises/default",
});

if (uploadedImages.blobs.length > 0)
  await del(uploadedImages.blobs.map((blob) => blob.url));

async function uploadBlobToVercel(exercise: ExerciseLocal, imagePath: string) {
  try {
    /*
    const uploadedImagesExercise = uploadedImages.blobs.filter((blob) =>
      blob.pathname.includes(exercise.id),
    );
    for (const uploadedImageExercise of uploadedImagesExercise) {
      if (uploadedImageExercise.size > 200) {
        console.log(`Skipping ${imagePath} because it's already uploaded`);
        return uploadedImageExercise.url;
      } else {
        await del(uploadedImageExercise.url);
        console.log(`Deleting ${uploadedImageExercise.pathname}`);
      }
    }
    */

    const { url } = await put(
      `exercises/default/${exercise.id}.jpg`,
      fs.readFileSync(imagePath),
      {
        access: "public",
        contentType: "image/jpeg",
      },
    );
    return url;
  } catch (error) {
    console.error(`Error uploading ${imagePath}:`, error);
    throw error;
  }
}

async function main() {
  const files = fs.readdirSync(path.join(__dirname, "translated"));
  files.slice(0, 2).forEach(async (file) => {
    if (!file.endsWith(".json")) return;

    const exercise: ExerciseLocal = require(`./translated/${file}`);
    console.log(`Processing ${exercise.id}: ${exercise.name}`);

    const imageDir = path.join(__dirname, "list", exercise.id);
    if (!fs.existsSync(imageDir)) {
      console.warn(`No images directory found for ${exercise.id}`);
      return;
    }

    const images = fs
      .readdirSync(imageDir)
      .filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg")) // Check for image formats
      .map((image) => path.join(imageDir, image));

    console.log(`Found ${images.length} images for ${exercise.id}`);

    /*
    const urls = await Promise.all(
      images.map((image) => uploadBlobToVercel(exercise, image)),
    );
    */
  });
}

main().catch((e) => console.error(e));
