import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--hm-cream)]">
      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
}

export default PublicLayout;