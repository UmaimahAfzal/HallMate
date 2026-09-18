import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || "/";

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // =====================================================
    // LOGIN WITH BACKEND
    // =====================================================

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to sign in. Please try again."
        );
      }

      // =====================================================
      // MAKE SURE THIS IS A CUSTOMER ACCOUNT
      // =====================================================

      if (data.user?.role !== "customer") {
        setError(
          "This account is not a customer account. Please use the correct sign-in page."
        );
        return;
      }

      // =====================================================
      // SAVE LOGGED-IN CUSTOMER
      // =====================================================

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
        notifications:
          data.user.notifications_enabled !== false,
        loggedIn: true,
      };

      localStorage.setItem(
        "hallmateUser",
        JSON.stringify(userData)
      );

      // =====================================================
      // RETURN TO ORIGINAL PAGE
      // =====================================================

      navigate(returnTo);
    } catch (error) {
      console.error("Sign in error:", error);

      setError(
        error.message ||
          "Unable to sign in. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-90px)] bg-[#F8F6F0] px-6 py-12 lg:px-10">

      <div className="mx-auto flex min-h-[70vh] max-w-[1100px] items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-2">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div className="hidden bg-[#0B2742] p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-[#C6922E]"
              >
                <ArrowLeft size={17} />
                Back to Home
              </Link>

              <div className="mt-20">

                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                  WELCOME TO HALLMATE
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  Your perfect venue
                  <br />
                  is waiting.
                </h1>

                <p className="mt-5 max-w-md leading-7 text-white/70">
                  Sign in to manage your bookings, keep track of your
                  requests, and make venue planning easier.
                </p>

              </div>

            </div>

            <p className="text-sm text-white/50">
              Smart Venue Booking
            </p>

          </div>


          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div className="p-7 sm:p-10 lg:p-12">

            {/* MOBILE BACK */}

            <Link
              to="/"
              className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] hover:text-[#C6922E] lg:hidden"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>


            {/* HEADING */}

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C6922E]">
                HALLMATE ACCOUNT
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#0B2239]">
                Sign In
              </h2>

              <p className="mt-2 text-gray-600">
                Sign in to continue to your HallMate account.
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="mt-8 space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="off"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#0B2239]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Password recovery will be available when the backend authentication system is connected."
                      )
                    }
                    disabled={loading}
                    className="text-xs font-semibold text-[#C6922E] hover:text-[#AD7F25]"
                  >
                    Forgot Password?
                  </button>

                </div>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="off"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-12 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-[#F7F4ED] hover:text-[#0B2742]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="rounded-xl border border-[#E8D8B7] bg-[#FBF7ED] px-4 py-3 text-sm font-medium leading-6 text-[#7A5A1A]">
                  {error}
                </div>
              )}


              {/* SIGN IN */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B2742] font-bold text-white transition hover:bg-[#173A5C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>


            {/* REGISTER */}

            <div className="mt-7 border-t border-[#E8E3D8] pt-6 text-center">

              <p className="text-sm text-gray-600">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/register", {
                    state: {
                      returnTo: returnTo,
                    },
                  })
                }
                className="mt-3 inline-flex items-center gap-2 font-semibold text-[#C6922E] hover:text-[#AD7F25]"
              >
                <UserPlus size={17} />
                Create an Account
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}