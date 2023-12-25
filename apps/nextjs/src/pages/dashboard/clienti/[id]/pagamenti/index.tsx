import AddPaymentButton from "#/components/clienti/payments/add-payment-button";
import PaymentsTable from "#/components/clienti/payments/table";
import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";
import { useRouter } from "next/router";

export default function PaymentView() {
  const router = useRouter();
  const id = router.query.id;

  const payments = trpc.paymentsRouter.listPayments.useQuery({
    clientId: id as string,
  });

  const plans = trpc.plansRouter.listPlans.useQuery({
    clientId: id as string,
  });

  return (
    <Sidebar>
      <DashboardTitle title="Pagamenti" />
      <div className="mb-8" />
      <AddPaymentButton
        payments={payments.data ?? []}
        plans={plans.data ?? []}
      />
      <div className="mb-8" />

      <PaymentsTable payments={payments.data ?? []} />
    </Sidebar>
  );
}
