import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  ClipboardList,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Search,
  Ban,
  CheckCircle,
} from "lucide-react";

const API = "http://localhost:5000";

export default function AdminDashboard() {
  const user = JSON.parse(
    localStorage.getItem("hallmateUser") || "null"
  );

  const adminId = user?.id;

  const [section, setSection] = useState(
    new URLSearchParams(window.location.search).get("section") || "overview"
  );

  const [stats, setStats] = useState({
    users: 0,
    owners: 0,
    halls: 0,
    bookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const headers = {
    "Content-Type": "application/json",
    "x-user-id": String(adminId || ""),
  };

  useEffect(() => {
    const updateSection = () => {
      setSection(
        new URLSearchParams(window.location.search).get("section") ||
          "overview"
      );
    };

    window.addEventListener("popstate", updateSection);

    const timer = setInterval(updateSection, 200);

    return () => {
      window.removeEventListener("popstate", updateSection);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!adminId) return;

    const load = async () => {
      try {
        setLoading(true);

        const dashboardResponse = await fetch(
          `${API}/api/admin/dashboard`,
          { headers }
        );

        const dashboardData = await dashboardResponse.json();

        if (!dashboardResponse.ok || !dashboardData.success) {
          throw new Error(
            dashboardData.message || "Failed to load dashboard."
          );
        }

        setStats(dashboardData.stats);
        setRecentBookings(dashboardData.recentBookings || []);

        if (section === "users") {
          const response = await fetch(
            `${API}/api/admin/users`,
            { headers }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message);
          }

          setUsers(data.users || []);
        }

        if (section === "halls") {
          const response = await fetch(
            `${API}/api/admin/halls`,
            { headers }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message);
          }

          setHalls(data.halls || []);
        }

        if (section === "bookings") {
          const response = await fetch(
            `${API}/api/admin/bookings`,
            { headers }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message);
          }

          setBookings(data.bookings || []);
        }

        if (section === "payments") {
          const response = await fetch(
            `${API}/api/admin/payments`,
            { headers }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message);
          }

          setPayments(data.payments || []);
        }

      } catch (error) {
        console.error("Admin loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [section, adminId]);

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const toggleUser = async (id, blocked) => {
    try {
      const response = await fetch(
        `${API}/api/admin/users/${id}/block`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            blocked: !blocked,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update user.");
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, is_blocked: !blocked }
            : item
        )
      );

    } catch (error) {
      alert(error.message);
    }
  };

  const toggleHall = async (id, active) => {
    try {
      const response = await fetch(
        `${API}/api/admin/halls/${id}/status`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            active: !active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update hall.");
      }

      setHalls((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, is_active: !active }
            : item
        )
      );

    } catch (error) {
      alert(error.message);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700",
      Accepted: "bg-green-50 text-green-700",
      Rejected: "bg-red-50 text-red-700",
      Cancelled: "bg-gray-100 text-gray-600",
      Paid: "bg-green-50 text-green-700",
      Unpaid: "bg-amber-50 text-amber-700",
      Active: "bg-green-50 text-green-700",
      Blocked: "bg-red-50 text-red-700",
      Disabled: "bg-red-50 text-red-700",
    };

    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  const filteredUsers = users.filter((item) =>
    `${item.name} ${item.email} ${item.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredHalls = halls.filter((item) =>
    `${item.name} ${item.location} ${item.owner_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredBookings = bookings.filter((item) =>
    `${item.booking_reference} ${item.customer_name} ${item.hall_name} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredPayments = payments.filter((item) =>
    `${item.payment_reference} ${item.booking_reference} ${item.customer_name} ${item.hall_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <section className="p-7 min-h-[80vh] flex items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading admin data...
        </p>
      </section>
    );
  }

  return (
    <section className="p-7">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-7">

        <div>
          <p className="text-sm font-medium text-[#C6922E]">
            Administration
          </p>

          <h1 className="text-3xl font-bold text-[#0B2742] mt-1">
            {section === "overview" && "Dashboard"}
            {section === "users" && "Users & Owners"}
            {section === "halls" && "Hall Management"}
            {section === "bookings" && "Booking Management"}
            {section === "payments" && "Payment Records"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {section === "overview"
              ? "Monitor HallMate activity and platform operations."
              : "Manage and monitor HallMate platform data."}
          </p>
        </div>

        {section !== "overview" && (
          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-[#DDD6C8] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#C6922E]"
            />

          </div>
        )}

      </div>


      {/* OVERVIEW */}
      {section === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            <StatCard
              icon={Users}
              label="Total Customers"
              value={stats.users}
            />

            <StatCard
              icon={Users}
              label="Hall Owners"
              value={stats.owners}
            />

            <StatCard
              icon={Building2}
              label="Total Halls"
              value={stats.halls}
            />

            <StatCard
              icon={ClipboardList}
              label="Total Bookings"
              value={stats.bookings}
            />

            <StatCard
              icon={Clock3}
              label="Pending Bookings"
              value={stats.pendingBookings}
            />

            <StatCard
              icon={CheckCircle2}
              label="Accepted Bookings"
              value={stats.acceptedBookings}
            />

            <StatCard
              icon={IndianRupee}
              label="Total Revenue"
              value={money(stats.revenue)}
            />

            <div className="rounded-2xl bg-[#0B2742] p-6 text-white shadow-sm">

              <p className="text-sm text-white/60">
                Platform Status
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-400" />

                <span className="font-semibold">
                  System Operational
                </span>
              </div>

            </div>

          </div>


          {/* SIMPLE VISUAL */}
          <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div className="rounded-2xl bg-white border border-[#E8E1D4] p-6">

              <h2 className="text-lg font-bold text-[#0B2742]">
                Booking Overview
              </h2>

              <div className="mt-6 space-y-5">

                <ProgressRow
                  label="Accepted"
                  value={stats.acceptedBookings}
                  total={stats.bookings}
                />

                <ProgressRow
                  label="Pending"
                  value={stats.pendingBookings}
                  total={stats.bookings}
                />

              </div>

            </div>


            <div className="rounded-2xl bg-white border border-[#E8E1D4] p-6">

              <h2 className="text-lg font-bold text-[#0B2742]">
                Platform Summary
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-4">

                <MiniMetric
                  label="Customers"
                  value={stats.users}
                />

                <MiniMetric
                  label="Owners"
                  value={stats.owners}
                />

                <MiniMetric
                  label="Halls"
                  value={stats.halls}
                />

                <MiniMetric
                  label="Revenue"
                  value={money(stats.revenue)}
                />

              </div>

            </div>

          </div>


          {/* RECENT BOOKINGS */}
          <div className="mt-7 rounded-2xl bg-white border border-[#E8E1D4] overflow-hidden">

            <div className="px-6 py-5 border-b border-[#EEE8DC]">
              <h2 className="text-lg font-bold text-[#0B2742]">
                Recent Bookings
              </h2>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-[#FAF8F3]">
                  <tr>
                    <th className="text-left px-6 py-4">Reference</th>
                    <th className="text-left px-6 py-4">Customer</th>
                    <th className="text-left px-6 py-4">Hall</th>
                    <th className="text-left px-6 py-4">Date</th>
                    <th className="text-left px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-[#F0EBE2]"
                    >
                      <td className="px-6 py-4 font-semibold text-[#0B2742]">
                        {booking.booking_reference}
                      </td>

                      <td className="px-6 py-4">
                        {booking.customer_name}
                      </td>

                      <td className="px-6 py-4">
                        {booking.hall_name}
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          booking.event_date
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        {statusBadge(booking.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>
        </>
      )}


      {/* USERS */}
      {section === "users" && (
        <DataTable title="Users & Owners">

          <table className="w-full text-sm">

            <thead className="bg-[#FAF8F3]">
              <tr>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((item) => {

                const blocked = item.is_blocked === true;

                return (
                  <tr
                    key={item.id}
                    className="border-t border-[#F0EBE2]"
                  >

                    <td className="px-6 py-4 font-semibold text-[#0B2742]">
                      {item.name}
                    </td>

                    <td className="px-6 py-4">
                      {item.email}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {item.role}
                    </td>

                    <td className="px-6 py-4">
                      {statusBadge(blocked ? "Blocked" : "Active")}
                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          toggleUser(item.id, blocked)
                        }
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                          blocked
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >

                        {blocked ? (
                          <>
                            <CheckCircle size={15} />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={15} />
                            Block
                          </>
                        )}

                      </button>

                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </DataTable>
      )}


      {/* HALLS */}
      {section === "halls" && (
        <DataTable title="Hall Management">

          <table className="w-full text-sm">

            <thead className="bg-[#FAF8F3]">
              <tr>
                <th className="text-left px-6 py-4">Hall</th>
                <th className="text-left px-6 py-4">Location</th>
                <th className="text-left px-6 py-4">Owner</th>
                <th className="text-left px-6 py-4">Capacity</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredHalls.map((item) => {

                const active = item.is_active !== false;

                return (
                  <tr
                    key={item.id}
                    className="border-t border-[#F0EBE2]"
                  >

                    <td className="px-6 py-4 font-semibold text-[#0B2742]">
                      {item.name}
                    </td>

                    <td className="px-6 py-4">
                      {item.location}
                    </td>

                    <td className="px-6 py-4">
                      {item.owner_name}
                    </td>

                    <td className="px-6 py-4">
                      {Number(item.capacity).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      {statusBadge(active ? "Active" : "Disabled")}
                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          toggleHall(item.id, active)
                        }
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                          active
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >

                        {active ? (
                          <>
                            <Ban size={15} />
                            Disable
                          </>
                        ) : (
                          <>
                            <CheckCircle size={15} />
                            Enable
                          </>
                        )}

                      </button>

                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </DataTable>
      )}


      {/* BOOKINGS */}
      {section === "bookings" && (
        <DataTable title="All Bookings">

          <table className="w-full text-sm">

            <thead className="bg-[#FAF8F3]">
              <tr>
                <th className="text-left px-6 py-4">Reference</th>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Hall</th>
                <th className="text-left px-6 py-4">Owner</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[#F0EBE2]"
                >

                  <td className="px-6 py-4 font-semibold text-[#0B2742]">
                    {item.booking_reference}
                  </td>

                  <td className="px-6 py-4">
                    {item.customer_name}
                  </td>

                  <td className="px-6 py-4">
                    {item.hall_name}
                  </td>

                  <td className="px-6 py-4">
                    {item.owner_name}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      item.event_date
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {money(item.price)}
                  </td>

                  <td className="px-6 py-4">
                    {statusBadge(item.status)}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </DataTable>
      )}


      {/* PAYMENTS */}
      {section === "payments" && (
        <DataTable title="Payment Records">

          <table className="w-full text-sm">

            <thead className="bg-[#FAF8F3]">
              <tr>
                <th className="text-left px-6 py-4">
                  Payment Reference
                </th>
                <th className="text-left px-6 py-4">
                  Booking
                </th>
                <th className="text-left px-6 py-4">
                  Customer
                </th>
                <th className="text-left px-6 py-4">
                  Hall
                </th>
                <th className="text-left px-6 py-4">
                  Amount
                </th>
                <th className="text-left px-6 py-4">
                  Method
                </th>
                <th className="text-left px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[#F0EBE2]"
                >

                  <td className="px-6 py-4 font-semibold text-[#0B2742]">
                    {item.payment_reference}
                  </td>

                  <td className="px-6 py-4">
                    {item.booking_reference}
                  </td>

                  <td className="px-6 py-4">
                    {item.customer_name}
                  </td>

                  <td className="px-6 py-4">
                    {item.hall_name}
                  </td>

                  <td className="px-6 py-4 font-bold">
                    {money(item.amount)}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {item.payment_method || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {statusBadge(item.status)}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </DataTable>
      )}

    </section>
  );
}


function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E8E1D4] p-6 shadow-sm">

      <div className="w-11 h-11 rounded-xl bg-[#F5EBD7] flex items-center justify-center">
        <Icon size={21} className="text-[#C6922E]" />
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#0B2742]">
        {value}
      </p>

    </div>
  );
}


function ProgressRow({ label, value, total }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>

      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-[#0B2742]">
          {label}
        </span>

        <span className="text-gray-500">
          {value}
        </span>
      </div>

      <div className="h-2 rounded-full bg-[#EEE8DC] overflow-hidden">

        <div
          className="h-full bg-[#D4A84F] rounded-full"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}


function MiniMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-[#FAF8F3] p-4">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#0B2742]">
        {value}
      </p>

    </div>
  );
}


function DataTable({ title, children }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E8E1D4] overflow-hidden">

      <div className="px-6 py-5 border-b border-[#EEE8DC]">
        <h2 className="text-lg font-bold text-[#0B2742]">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        {children}
      </div>

    </div>
  );
}