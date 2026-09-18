import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    setError("");
    setMessage("");

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    // =====================================================
    // REGISTER WITH BACKEND
    // =====================================================

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password: formData.password,
            role: "customer",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create your account."
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setMessage(
        "Account created successfully. Redirecting to Sign In..."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/sign-in", {
          state: {
            returnTo,
          },
        });
      }, 700);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
          "Unable to create your account. Please try again."
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
                  JOIN HALLMATE
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  Plan your events
                  <br />
                  with confidence.
                </h1>

                <p className="mt-5 max-w-md leading-7 text-white/70">
                  Create your HallMate account to book venues,
                  manage your requests, and keep track of your events.
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
                Create Account
              </h2>

              <p className="mt-2 text-gray-600">
                Create your account to start booking halls.
              </p>

            </div>


            {/* SUCCESS MESSAGE */}

            {message && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#BFE6CE] bg-[#F0FBF4] px-4 py-3 text-sm text-[#147A48]">

                <CheckCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>{message}</p>

              </div>
            )}


            {/* ERROR MESSAGE */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                </div>

              </div>


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
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Password
                </label>

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
                    placeholder="Create a password"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-12 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
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


              {/* CONFIRM PASSWORD */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-12 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-[#F7F4ED] hover:text-[#0B2742]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B2742] font-bold text-white transition hover:bg-[#173A5C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>

            </form>


            {/* SIGN IN */}

            <div className="mt-7 border-t border-[#E8E3D8] pt-6 text-center">

              <p className="text-sm text-gray-600">
                Already have an account?
              </p>

              <Link
                to="/sign-in"
                state={{ returnTo }}
                className="mt-3 inline-block font-semibold text-[#C6922E] hover:text-[#AD7F25]"
              >
                Sign In
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}