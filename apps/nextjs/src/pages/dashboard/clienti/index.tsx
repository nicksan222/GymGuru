import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { Button } from "#/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { trpc } from "#/src/utils/trpc";
import Link from "next/link";

export default function ClientsList() {
  const clients = trpc.clientRouter.listClients.useQuery();

  return (
    <Sidebar>
      <DashboardTitle title="Clienti" subtitle="Gestisci i tuoi clienti" />
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cognome</TableHead>
            <TableHead>Dettagli</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.data?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.firstName}</TableCell>
              <TableCell>{client.lastName}</TableCell>
              <TableCell>
                <Link href={"/dashboard/clienti/" + client.id}>
                  <Button>Dettagli</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Sidebar>
  );
}
