import { trpc } from "#/src/utils/trpc";
import { test, expect } from "@playwright/test";

test.use({
  storageState: "playwright/.auth/user.json",
});

test("creation of an exercise", async ({ page }) => {
  await page.goto("/dashboard/esercizi/add");

  // Filling the name of the exercise
  await page.fill('input[name="name"]', "Test exercise");

  // Adding two image links
  // Before each, pressing the "Aggiungi immagine" button
  for (const i of [0, 1]) {
    await page.click("text=Aggiungi immagine");
    await page.fill(
      `input[name="imageUrl.${i}"]`,
      `https://picsum.photos/${i}`,
    );
  }

  // Are the images correctly displayed?
  // There should be an input with the image url
  const images = await page.$$("input[name^='imageUrl']");
  expect(images.length).toBe(2);

  // Click the button with primary-muscle-select data-test
  await page.click('[data-test="primary-muscle-select"]');

  // Wait for the modal to appear
  await page.waitForSelector('[data-test="muscle-modal"]');
  expect(await page.isVisible('[data-test="muscle-modal"]')).toBeTruthy();

  // Get all the primary-muscle data-test
  const primaryMuscles = await page.$$('[data-test="primary-muscle"]');
  expect(primaryMuscles.length).toBeGreaterThan(0);
  // Click the first one if it exists
  if (primaryMuscles[0]) {
    await primaryMuscles[0].click();
  } else {
    throw new Error("No primary muscles found");
  }

  // Doing the same for the secondary muscles
  await page.click('[data-test="secondary-muscle-select"]');
  await page.waitForSelector('[data-test="muscle-modal"]');
  expect(await page.isVisible('[data-test="muscle-modal"]')).toBeTruthy();
  const secondaryMuscles = await page.$$('[data-test="secondary-muscle"]');
  expect(secondaryMuscles.length).toBeGreaterThan(2);
  if (secondaryMuscles[0] && secondaryMuscles[1]) {
    await secondaryMuscles[0].click();
    await secondaryMuscles[1].click();
  } else {
    throw new Error("No secondary muscles found");
  }

  await page.click('[data-test="exercise-type-select"]');
  await page.waitForSelector('[data-test="exercise-type-modal"]');

  // Get all the exercise types
  const exerciseTypes = await page.$$('[data-test="exercise-type"]');
  expect(exerciseTypes.length).toBeGreaterThan(0);
  // Click the first one if it exists
  if (exerciseTypes[0]) {
    await exerciseTypes[0].click();
  } else {
    throw new Error("No exercise types found");
  }

  // Push submit
  await page.click('[data-test="submit-exercise-button"]');
});
