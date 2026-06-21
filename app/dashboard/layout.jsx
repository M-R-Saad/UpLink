import DashboardSidebar from "../../components/shared/DashboardSidebar";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--bg)" }}>{children}</main>
    </div>
  );
}
