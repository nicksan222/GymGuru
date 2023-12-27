import { router } from "../../trpc";
import createClient from "./create";
import deleteClient from "./delete";
import getClient from "./get";
import listClients from "./list";
import updateClient from "./update";

export const clientRouter = router({
  listClients,
  getClient,
  deleteClient,
  createClient,
  updateClient,
});
