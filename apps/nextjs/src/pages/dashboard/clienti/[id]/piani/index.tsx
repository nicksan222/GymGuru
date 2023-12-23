import PianiTable from "#/components/clienti/piani/list/pianiTable";
import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { Button } from "#/components/ui/button";
import { trpc } from "#/src/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ClientiView() {
  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return null;

  const cliente = trpc.clientRouter.getClient.useQuery({ id });
  const piani = trpc.plansRouter.listPlans.useQuery({ clientId: id });

  if (!cliente.data) return <></>;

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

      <PianiTable piani={piani.data ?? []} cliente={cliente.data} />

      <Link href={`/dashboard/clienti/${id}/piani/add`}>
        <Button className="mt-8">Aggiungi piano</Button>
      </Link>
    </Sidebar>
  );
}
