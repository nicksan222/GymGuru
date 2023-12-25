import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Toaster } from "#/components/ui/toaster";
import { useToast } from "#/components/ui/use-toast";
import { trpc } from "#/src/utils/trpc";
import { Payment, WorkoutPlan } from "@acme/db";
import { useEffect, useState } from "react";

interface Props {
  plans: Partial<WorkoutPlan>[];
  payments: Payment[];
}

export default function AddPaymentButton({ payments, plans }: Props) {
  const unpaidPlans = plans.filter((plan) => {
    return !payments.some((payment) => payment.planId === plan.id);
  });

  const [selectedPlan, setSelectedPlan] = useState<Partial<WorkoutPlan> | null>(
    null,
  );
  const [amount, setAmount] = useState<number | null>(null);

  const mutation = trpc.paymentsRouter.createPayment.useMutation();
  const { toast } = useToast();

  function addPayment() {
    if (!selectedPlan) return;
    if (!amount) return;
    if (!selectedPlan.clientId) return;
    if (!selectedPlan.id) return;

    mutation.mutate({
      planId: selectedPlan.id,
      amount,
      clientId: selectedPlan.clientId,
    });
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      setSelectedPlan(null);
      setAmount(null);
      toast({
        title: "Pagamento aggiunto",
        description: "Il pagamento è stato aggiunto con successo",
        color: "green",
      });
    }

    if (mutation.error) {
      toast({
        title: "Errore",
        description: "Qualcosa è andato storto",
        color: "red",
      });
    }
  }, [mutation.error, mutation.isSuccess, toast]);

  return (
    <>
      <Toaster />
      <Dialog>
        <DialogTrigger>
          <Button variant="default">Aggiungi pagamento</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scegli il piano</DialogTitle>
            <DialogDescription>Quale piano è stato pagato?</DialogDescription>
          </DialogHeader>
          <Select
            onValueChange={(value) => {
              const plan = plans.find((plan) => plan.id === value);
              setSelectedPlan(plan ?? null);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleziona un piano" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Piani</SelectLabel>
                {unpaidPlans.map((plan) => {
                  return (
                    <SelectItem key={plan.id} value={plan.id ?? ""}>
                      {plan.startDate?.toLocaleDateString()} -{" "}
                      {plan.endDate?.toLocaleDateString()}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            placeholder="Importo"
            type="number"
            onChange={(event) => {
              setAmount(Number(event.target.value));
            }}
          />
          <Button
            onClick={() => {
              addPayment();
            }}
          >
            Salva
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
