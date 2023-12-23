import ClientiTable from "#/components/clienti/list/table";
import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";

export default function ClientsList() {
  const clients = trpc.clientRouter.listClients.useQuery();

  return (
    <Sidebar>
      <DashboardTitle title="Clienti" subtitle="Gestisci i tuoi clienti" />
      <div className="mt-8" />
      <ClientiTable clients={clients.data ?? []} />
    </Sidebar>
  );
}
