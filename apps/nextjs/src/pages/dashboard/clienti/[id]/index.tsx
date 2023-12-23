import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";
import { useRouter } from "next/router";

export default function DetailsClient() {
  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return null;

  const client = trpc.clientRouter.getClient.useQuery({ id });

  return (
    <Sidebar>
      <DashboardTitle
        title={client.data?.firstName + " " + client.data?.lastName}
        subtitle="Dettagli del cliente"
      />
    </Sidebar>
  );
}
