import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
} from "lucide-react";

export default function OwnerRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const owner = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      notifications: true,
      loggedIn: false,
    };

    localStorage.setItem(
      "hallmateOwner",
      JSON.stringify(owner)
    );

    navigate("/owner/sign-in");
  };

  return (
    <section className="min-h-[calc(100vh-90px)] bg-[#F8F6F0] px-6 py-12 lg:px-10">

      <div className="mx-auto flex min-h-[70vh] max-w-[1100px] items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden bg-[#0B2742] p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-[#C6922E]"
              >
                <ArrowLeft size={17} />
                Back to Home
              </Link>

              <div className="mt-16">

                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
                  HALLMATE FOR OWNERS
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  List your hall.
                  <br />
                  Reach more customers.
                </h1>

                <p className="mt-5 max-w-md leading-7 text-white/70">
                  Create your HallMate owner account and start managing
                  your venue, availability, and booking requests in one place.
                </p>

              </div>

            </div>

            <p className="text-sm text-white/50">
              Smart Venue Booking
            </p>

          </div>


          {/* RIGHT SIDE */}
          <div className="p-7 sm:p-10 lg:p-12">

            {/* MOBILE BACK */}
            <Link
              to="/"
              className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2742] hover:text-[#C6922E] lg:hidden"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>


            {/* HEADER */}
            <div>

              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C6922E]">
                HALL OWNER ACCOUNT
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#0B2239]">
                Create Owner Account
              </h2>

              <p className="mt-2 text-gray-600">
                Register your account to start managing your hall.
              </p>

            </div>


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
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

                  <UserRound
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
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
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
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
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
                    autoComplete="tel"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-4 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
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
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-12 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    placeholder="Re-enter your password"
                    required
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] bg-white pl-11 pr-12 text-[#0B2239] outline-none transition placeholder:text-gray-400 focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                  <button
                    type="button"
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


              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}


              {/* REGISTER */}
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0B2742] font-bold text-white transition hover:bg-[#173A5C]"
              >
                Create Owner Account
              </button>

            </form>


            {/* SIGN IN */}
            <div className="mt-7 border-t border-[#E8E3D8] pt-6 text-center">

              <p className="text-sm text-gray-600">
                Already have an owner account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/owner/sign-in")}
                className="mt-3 inline-flex items-center gap-2 font-semibold text-[#C6922E] hover:text-[#AD7F25]"
              >
                <LogIn size={17} />
                Owner Sign In
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}