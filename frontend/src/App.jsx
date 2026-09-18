import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import AdminLayout from "./layouts/AdminLayout";

// CUSTOMER
import Home from "./pages/public/Home";
import ExploreHalls from "./pages/public/ExploreHalls";
import HallDetails from "./pages/public/HallDetails";
import HallBooking from "./pages/public/HallBooking";
import AvailabilityResult from "./pages/public/AvailabilityResult";
import HallDialog from "./components/HallDialog";
import BookingReview from "./pages/public/BookingReview";
import BookingConfirmation from "./pages/public/BookingConfirmation";
import MyBookings from "./pages/public/MyBookings";
import SignIn from "./pages/public/SignIn";
import Register from "./pages/public/Register";
import Profile from "./pages/public/Profile";
import Payment from "./pages/customer/Payment";
import Notifications from "./pages/Notifications";
import AIAssistant from "./pages/public/AIAssistant";
import HowItWorks from "./pages/public/HowItWorks";

// OWNER
import OwnerSignIn from "./pages/owner/OwnerSignIn";
import OwnerRegister from "./pages/owner/OwnerRegister";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import HallManagement from "./pages/owner/HallManagement";
import OwnerAvailability from "./pages/owner/OwnerAvailability";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerProfile from "./pages/owner/OwnerProfile";
import OwnerNotifications from "./pages/owner/OwnerNotifications";
import OwnerListHall from "./pages/owner/OwnerListHall";

// ADMIN
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";

function Placeholder({ title }) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#F8F6F0] px-6">
      <h1 className="text-4xl font-bold text-[#0B2742]">
        {title}
      </h1>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Routes>

        {/* ================= CUSTOMER ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreHalls />} />
          <Route path="/hall/:id" element={<HallDetails />} />
          <Route path="/hall/:id/booking" element={<HallBooking />} />
          <Route
            path="/hall/:id/availability"
            element={<AvailabilityResult />}
          />
          <Route
            path="/hall/:id/review"
            element={<BookingReview />}
          />
          <Route
            path="/hall/:id/confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
<Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
        </Route>


        {/* ================= OWNER ================= */}
        <Route path="/owner/sign-in" element={<OwnerSignIn />} />
        <Route path="/owner/register" element={<OwnerRegister />} />

        <Route element={<OwnerLayout />}>
          <Route
            path="/owner/dashboard"
            element={<OwnerDashboard />}
          />
          <Route
            path="/owner/my-hall"
            element={<HallManagement />}
          />
          <Route
            path="/owner/availability"
            element={<OwnerAvailability />}
          />
          <Route
            path="/owner/bookings"
            element={<OwnerBookings />}
          />
          <Route
            path="/owner/notifications"
            element={<OwnerNotifications />}
          />
          <Route
            path="/owner/profile"
            element={<OwnerProfile />}
          />
          <Route
            path="/owner/list-hall"
            element={<OwnerListHall />}
          />
        </Route>


        {/* ================= ADMIN ================= */}

        {/* IMPORTANT:
            Admin Sign In is OUTSIDE OwnerLayout
        */}
        <Route
          path="/admin/sign-in"
          element={<AdminSignIn />}
        />

        {/* Admin pages use AdminLayout only */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>

      </Routes>

      <HallDialog />
    </>
  );
}