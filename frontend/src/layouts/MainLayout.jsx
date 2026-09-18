import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#0B2239]">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}