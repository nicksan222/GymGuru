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
import { WorkoutPlan } from "@acme/db"; // Import the type definition for Client
import { trpc } from "#/src/utils/trpc";
import { useToast } from "#/components/ui/use-toast";

interface ActionsCellProps {
  piano: Partial<WorkoutPlan>; // Assuming Client has an 'id' field and others as needed
}

export default function ActionsCell({ piano }: ActionsCellProps) {
    return (

    )
}
