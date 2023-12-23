import React from "react";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Client } from "@acme/db"; // Import the type definition for Client
import { trpc } from "#/src/utils/trpc";
import { useToast } from "#/components/ui/use-toast";

interface ActionsCellProps {
  client: Partial<Client>; // Assuming Client has an 'id' field and others as needed
}

const ActionsCell: React.FC<ActionsCellProps> = ({ client }) => {
  const mutation = trpc.clientRouter.deleteClient.useMutation();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (
      !confirm(
        "Sei sicuro di voler eliminare l'utente e i suoi dati associati?",
      )
    )
      return;
    if (!client.id) return;

    try {
      const result = await mutation.mutateAsync({ id: client.id });

      if (result.count === 1) {
        window.location.reload();
      } else {
        toast({
          title: "Errore",
          description:
            "Si è verificato un errore durante l'eliminazione dell'utente",
          color: "red",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante l'eliminazione dell'utente",
        color: "red",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Apri menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
        <Link href={`/dashboard/clienti/${client.id}`}>
          <DropdownMenuItem>Visualizza</DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/clienti/${client.id}/progressi`}>
          <DropdownMenuItem>Progressi</DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/clienti/${client.id}/piani`}>
          <DropdownMenuItem>Gestisci piani</DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/clienti/${client.id}/pagamenti`}>
          <DropdownMenuItem>Pagamenti</DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/clienti/${client.id}/edit`}>
          <DropdownMenuItem>Modifica</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>Elimina</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
