import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";
import { useRouter } from "next/router";

export default function ClientiView() {
  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return null;

  const cliente = trpc.clientRouter.getClient.useQuery({ id });

  return (
    <Sidebar>
      {!cliente.isLoading && cliente.data && (
        <DashboardTitle
          title="Piani"
          subtitle={
            "Gestisci i piani di allenamento di " +
            cliente.data?.firstName +
            " " +
            cliente.data?.lastName
          }
        />
      )}
      <div className="mt-8" />
    </Sidebar>
  );
}
