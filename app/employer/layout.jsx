import EmployerSidebar from "../../components/shared/EmployerSidebar";
import DashboardTopbar from "../../components/shared/DashboardTopbar";
export default function EmployerLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <EmployerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
