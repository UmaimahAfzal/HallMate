import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Bell,
  LogOut,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("hallmateUser") || "{}"
  );

  const [formData, setFormData] = useState({
    name: savedUser.name || "",
    email: savedUser.email || "",
    phone: savedUser.phone || "",
  });

  const [notifications, setNotifications] = useState(
    savedUser.notifications !== false
  );

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom message
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...savedUser,
      ...formData,
      notifications,
      loggedIn: true,
    };

    localStorage.setItem(
      "hallmateUser",
      JSON.stringify(updatedUser)
    );

    showMessage(
      "success",
      "Your profile has been updated successfully."
    );
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    const currentPassword = savedUser.password || "";

    if (!currentPassword) {
      showMessage(
        "error",
        "No password is available for this account."
      );
      return;
    }

    if (passwordData.currentPassword !== currentPassword) {
      showMessage(
        "error",
        "Current password is incorrect."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage(
        "error",
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      showMessage(
        "error",
        "New password and confirmation do not match."
      );
      return;
    }

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      showMessage(
        "error",
        "New password must be different from the current password."
      );
      return;
    }

    const updatedUser = {
      ...savedUser,
      password: passwordData.newPassword,
    };

    localStorage.setItem(
      "hallmateUser",
      JSON.stringify(updatedUser)
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordModal(false);

    showMessage(
      "success",
      "Your password has been changed successfully."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("hallmateUser");
    navigate("/");
  };

  return (
    <section className="relative min-h-[calc(100vh-90px)] bg-[#F8F6F0] px-6 py-12 lg:px-10 lg:py-16">

      {/* CUSTOM MESSAGE */}
      {message.text && (
        <div className="fixed right-6 top-24 z-[100] w-[calc(100%-48px)] max-w-[420px]">

          <div
            className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-lg ${
              message.type === "success"
                ? "border-[#BFE8D2]"
                : "border-[#F0C7C7]"
            }`}
          >

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                message.type === "success"
                  ? "bg-[#DDF8EA] text-[#15945A]"
                  : "bg-[#FDE8E8] text-[#C53B3B]"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>

            <div className="flex-1">

              <p className="font-bold text-[#0B2239]">
                {message.type === "success"
                  ? "Success"
                  : "Something went wrong"}
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                {message.text}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setMessage({
                  type: "",
                  text: "",
                })
              }
              className="text-gray-400 transition hover:text-[#0B2742]"
              aria-label="Close message"
            >
              <X size={18} />
            </button>

          </div>

        </div>
      )}


      <div className="mx-auto max-w-[1000px]">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C6922E]">
            HALLMATE ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2239] sm:text-4xl">
            Profile & Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your personal information and account preferences.
          </p>

        </div>


        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* PROFILE CARD */}
          <div className="rounded-2xl bg-[#0B2742] p-7 text-white shadow-sm">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <UserRound
                size={38}
                className="text-[#C6922E]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              {formData.name || "HallMate User"}
            </h2>

            <p className="mt-1 break-all text-sm text-white/60">
              {formData.email || "No email added"}
            </p>

            <div className="mt-7 border-t border-white/10 pt-6">

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <LogOut size={18} />
                Sign Out
              </button>

            </div>

          </div>


          {/* SETTINGS */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <form onSubmit={handleSave}>

              <div className="border-b border-[#E8E3D8] pb-6">

                <h2 className="text-xl font-bold text-[#0B2239]">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your basic account information.
                </p>

              </div>


              {/* NAME */}
              <div className="mt-6">

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Full Name
                </label>

                <div className="relative">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-4 outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                </div>

              </div>


              {/* EMAIL */}
              <div className="mt-5">

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-4 outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                </div>

              </div>


              {/* PHONE */}
              <div className="mt-5">

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-4 outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                </div>

              </div>


              {/* NOTIFICATIONS */}
              <div className="mt-8 border-t border-[#E8E3D8] pt-6">

                <div className="flex items-start justify-between gap-5">

                  <div className="flex gap-3">

                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBF7ED] text-[#C6922E]">
                      <Bell size={18} />
                    </div>

                    <div>

                      <h3 className="font-bold text-[#0B2239]">
                        Booking Notifications
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Receive updates when your booking request is
                        accepted or its status changes.
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNotifications(!notifications)
                    }
                    className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
                      notifications
                        ? "bg-[#C6922E]"
                        : "bg-gray-300"
                    }`}
                    aria-label="Toggle booking notifications"
                  >

                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        notifications
                          ? "left-6"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>

              </div>


              {/* SAVE */}
              <div className="mt-8 flex justify-end">

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0B2742] px-6 py-3 font-bold text-white transition hover:bg-[#173A5C]"
                >
                  <Save size={18} />
                  Save Changes
                </button>

              </div>

            </form>


            {/* ACCOUNT OPTIONS */}
            <div className="mt-8 border-t border-[#E8E3D8] pt-6">

              <h2 className="text-lg font-bold text-[#0B2239]">
                Account Options
              </h2>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#E8E3D8] p-4 text-left transition hover:border-[#C6922E] hover:bg-[#FBF7ED]"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7F4ED] text-[#0B2742]">
                  <Lock size={19} />
                </div>

                <div className="flex-1">

                  <p className="font-semibold text-[#0B2239]">
                    Password
                  </p>

                  <p className="text-sm text-gray-500">
                    Click here to change your account password.
                  </p>

                </div>

                <span className="text-sm font-semibold text-[#C6922E]">
                  Change
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0B2239]/50 px-6 py-8 backdrop-blur-sm">

          <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-[#E8E3D8] px-6 py-5 sm:px-7">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C6922E]">
                  ACCOUNT SECURITY
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0B2239]">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your HallMate account password.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#F7F4ED] hover:text-[#0B2742]"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            {/* MODAL FORM */}
            <form
              onSubmit={handleChangePassword}
              className="space-y-5 px-6 py-6 sm:px-7"
            >

              {/* CURRENT PASSWORD */}
              <div>

                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Current Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-12 outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-[#F7F4ED] hover:text-[#0B2742]"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* NEW PASSWORD */}
              <div>

                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  New Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-12 outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-[#F7F4ED] hover:text-[#0B2742]"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Use at least 6 characters.
                </p>

              </div>


              {/* CONFIRM PASSWORD */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#0B2239]"
                >
                  Confirm New Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
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
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                    className="h-12 w-full rounded-xl border border-[#D9D3C7] pl-11 pr-12 outline-none focus:border-[#C6922E] focus:ring-2 focus:ring-[#C6922E]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-[#F7F4ED] hover:text-[#0B2742]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="rounded-xl border border-[#D9D3C7] px-5 py-3 font-semibold text-[#0B2742] transition hover:bg-[#F7F4ED]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#0B2742] px-5 py-3 font-bold text-white transition hover:bg-[#173A5C]"
                >
                  Update Password
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}