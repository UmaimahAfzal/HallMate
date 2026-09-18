import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CalendarCheck,
  Clock,
  CreditCard,
} from "lucide-react";

export default function OwnerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOwner = () => {
    const saved =
      localStorage.getItem("hallmateOwner") ||
      sessionStorage.getItem("hallmateOwner");

    return saved ? JSON.parse(saved) : null;
  };

  const fetchNotifications = async () => {
    try {
      const owner = getOwner();

      if (!owner?.id) {
        setNotifications([]);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${owner.id}`
      );

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to load owner notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PATCH",
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getIcon = (title = "") => {
    const value = title.toLowerCase();

    if (value.includes("payment")) {
      return <CreditCard size={21} />;
    }

    if (value.includes("accepted")) {
      return <CalendarCheck size={21} />;
    }

    if (value.includes("rejected") || value.includes("cancelled")) {
      return <Clock size={21} />;
    }

    return <Bell size={21} />;
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#F8F6F0] px-8 py-10">

      <div className="mx-auto max-w-[1050px]">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#C6922E]">
              HallMate Owner Portal
            </p>

            <h1 className="text-4xl font-bold text-[#0B2742]">
              Notifications
            </h1>

            <p className="mt-2 text-[#6F7B89]">
              Stay updated about your hall bookings and activities.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="rounded-full bg-[#0B2742] px-4 py-2 text-sm font-semibold text-white">
              {unreadCount} unread
            </div>
          )}

        </div>


        {/* NOTIFICATIONS CARD */}
        <div className="overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white shadow-sm">

          {loading ? (

            <div className="px-6 py-16 text-center text-[#6F7B89]">
              Loading notifications...
            </div>

          ) : notifications.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F4ED] text-[#C6922E]">
                <Bell size={29} />
              </div>

              <h2 className="text-xl font-bold text-[#0B2742]">
                No notifications yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#7A8491]">
                New booking requests and important updates will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-[#EEEAE1]">

              {notifications.map((notification) => (

                <div
                  key={notification.id}
                  className={`flex gap-4 px-6 py-5 transition ${
                    notification.is_read
                      ? "bg-white"
                      : "bg-[#FCFAF4]"
                  }`}
                >

                  {/* ICON */}
                  <div
                    className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      notification.is_read
                        ? "bg-[#F1F3F5] text-[#6F7B89]"
                        : "bg-[#F7F0DE] text-[#C6922E]"
                    }`}
                  >
                    {getIcon(notification.title)}
                  </div>


                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="font-bold text-[#0B2742]">
                          {notification.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#66727F]">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.is_read && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#C6922E]" />
                      )}

                    </div>


                    {/* DATE + READ */}
                    <div className="mt-3 flex items-center gap-4">

                      <span className="text-xs font-medium text-[#9AA2AC]">
                        {notification.created_at
                          ? new Date(
                              notification.created_at
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>

                      {!notification.is_read && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="flex items-center gap-1 text-xs font-bold text-[#C6922E] transition hover:text-[#0B2742]"
                        >
                          <Check size={14} />
                          Mark as read
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}