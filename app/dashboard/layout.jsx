import DashboardSidebar from "../../components/shared/DashboardSidebar";
import DashboardTopbar from "../../components/shared/DashboardTopbar";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
