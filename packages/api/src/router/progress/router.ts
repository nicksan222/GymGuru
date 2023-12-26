import { router } from "../../trpc";
import createProgress from "./create";
import deleteProgress from "./delete";
import listProgress from "./list";
import updateProgress from "./update";

export const progressRouter = router({
  createProgress,
  deleteProgress,
  listProgress,
  updateProgress,
});
