import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import ScrollToTop from "../../components/shared/ScrollToTop";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
