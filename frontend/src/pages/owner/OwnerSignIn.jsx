import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OwnerSignIn() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Only owners can use the Owner Sign In page.
      if (data.user.role !== "owner") {
        throw new Error(
          "This account is not registered as a hall owner."
        );
      }

      // Save the logged-in owner.
      const ownerData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
      };

      const storage = formData.remember
        ? localStorage
        : sessionStorage;

      storage.setItem("hallmateOwner", JSON.stringify(ownerData));

      // Go to the real owner dashboard.
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("Owner login error:", err);
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] bg-[#F8F6F0] px-4 py-8 md:px-8">

      <div className="mx-auto grid min-h-[680px] max-w-[1180px] overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">

        {/* =====================================================
            LEFT — OWNER BRANDING PANEL
        ===================================================== */}
        <section className="relative hidden overflow-hidden bg-[#0B2742] md:flex">

          <div className="relative z-10 flex w-full flex-col p-10 lg:p-12">

            {/* BACK */}
            <Link
              to="/"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            {/* BRANDING */}
            <div className="mt-auto mb-auto">

              <p className="mb-5 text-sm font-bold tracking-[0.2em] text-[#D9A441]">
                HALLMATE FOR OWNERS
              </p>

              <h1 className="max-w-md text-4xl font-bold leading-tight text-white lg:text-5xl">
                Manage your hall.
                <br />
                Grow your business.
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-white/75 lg:text-lg">
                Manage your hall listings, availability and booking
                requests from one simple place.
              </p>

            </div>

            {/* SMALL BRAND FOOTER */}
            <div className="flex items-center gap-3">

              <div>
                <p className="text-[9px] font-semibold tracking-[0.2em] text-white/60">
                  SMART VENUE BOOKING
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            RIGHT — SIGN IN FORM
        ===================================================== */}
        <section className="flex items-center bg-white px-7 py-10 sm:px-10 lg:px-14">

          <div className="w-full max-w-[500px]">

            {/* MOBILE BACK */}
            <Link
              to="/"
              className="mb-8 flex w-fit items-center gap-2 text-sm font-medium text-[#53677A] hover:text-[#0B2742] md:hidden"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            {/* TITLE */}
            <div className="mb-8">

              <p className="mb-3 text-sm font-bold tracking-[0.16em] text-[#C6922E]">
                WELCOME BACK
              </p>

              <h2 className="text-4xl font-bold tracking-tight text-[#0B2742]">
                Owner Sign In
              </h2>

              <p className="mt-3 text-base text-[#687B8D]">
                Sign in to manage your halls and bookings.
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#0B2742]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8B8]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="h-14 w-full rounded-xl border border-[#DDD8CC] bg-white pl-12 pr-4 text-[15px] text-[#0B2742] outline-none transition placeholder:text-[#9AA8B8] focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#0B2742]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-[#C6922E] hover:underline"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8B8]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="h-14 w-full rounded-xl border border-[#DDD8CC] bg-white pl-12 pr-12 text-[15px] text-[#0B2742] outline-none transition placeholder:text-[#9AA8B8] focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA8B8] transition hover:text-[#0B2742]"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* REMEMBER ME */}
              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#CFC8BA] accent-[#C6922E]"
                />

                <span className="text-sm text-[#687B8D]">
                  Remember me
                </span>

              </label>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl bg-[#D9A441] text-[16px] font-bold text-[#0B2742] shadow-sm transition hover:bg-[#C6922E] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            {/* REGISTER */}
            <div className="mt-9 border-t border-[#E5E0D7] pt-7 text-center">

              <p className="text-sm text-[#687B8D]">

                Don't have an owner account?{" "}

                <Link
                  to="/owner/register"
                  className="font-semibold text-[#C6922E] hover:underline"
                >
                  Register as a Hall Owner
                </Link>

              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}