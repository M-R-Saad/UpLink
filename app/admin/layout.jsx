import AdminSidebar from "../../components/shared/AdminSidebar";
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--bg)" }}>{children}</main>
    </div>
  );
}
