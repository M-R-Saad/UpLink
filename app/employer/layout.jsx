import EmployerSidebar from "../../components/shared/EmployerSidebar";
export default function EmployerLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <EmployerSidebar />
      <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--bg)" }}>{children}</main>
    </div>
  );
}
