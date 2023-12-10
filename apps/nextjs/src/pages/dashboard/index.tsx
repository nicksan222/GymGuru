import { Sidebar } from "#/components/sidebar";

export default function DashboardHome() {
  return (
    <Sidebar>
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div></div>
      </div>
    </Sidebar>
  );
}
