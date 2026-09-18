import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";

export default function AdminSignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.user?.role !== "admin") {
        setError("This account does not have administrator access.");
        return;
      }

      localStorage.setItem("hallmateUser", JSON.stringify(data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0B2742] hover:text-[#C6922E]"
        >
          <ArrowLeft size={17} />
          Back to HallMate
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-xl border border-[#E8E1D4]">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#0B2742] flex items-center justify-center">
              <ShieldCheck className="text-[#D4A84F]" size={32} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0B2742]">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage HallMate
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0B2742] mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@hallmate.com"
                  className="w-full rounded-xl border border-[#DDD6C8] bg-[#FAF9F5] py-3.5 pl-11 pr-4 outline-none focus:border-[#C6922E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2742] mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-[#DDD6C8] bg-[#FAF9F5] py-3.5 pl-11 pr-4 outline-none focus:border-[#C6922E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0B2742] py-3.5 text-sm font-bold text-white transition hover:bg-[#123957] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In to Admin Portal"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-5">
          HallMate Administration
        </p>
      </div>
    </div>
  );
}