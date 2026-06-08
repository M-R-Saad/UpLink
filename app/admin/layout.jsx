import AdminSidebar from "../../components/shared/AdminSidebar";
import DashboardTopbar from "../../components/shared/DashboardTopbar";
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
