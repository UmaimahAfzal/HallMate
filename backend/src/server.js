const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// POSTGRESQL
// =====================================================

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hallmate",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT) || 5432,
});

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "HallMate backend is running!",
  });
});

// =====================================================
// DATABASE HEALTH
// =====================================================

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "HallMate backend connected to PostgreSQL!",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

// =====================================================
// AUTH - REGISTER
// =====================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = "customer",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (!["customer", "owner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
        (name, email, phone, password_hash, role)
       VALUES
        ($1, $2, $3, $4, $5)
       RETURNING
        id, name, email, phone, role, notifications_enabled, created_at`,
      [
        name,
        email.toLowerCase(),
        phone || null,
        passwordHash,
        role,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
});

// =====================================================
// AUTH - LOGIN
// =====================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

const result = await pool.query(
  `SELECT
    id,
    name,
    email,
    phone,
    password_hash,
    role,
    notifications_enabled,
    is_blocked
   FROM users
   WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    if (user.is_blocked) {
  return res.status(403).json({
    success: false,
    message: "This account has been blocked by the administrator.",
  });
}

    delete user.password_hash;

    res.json({
      success: true,
      message: "Login successful.",
      user,
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

// =====================================================
// HALLS - GET ALL
// =====================================================

app.get("/api/halls", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        h.id,
        h.owner_id,
        h.name,
        h.location,
        h.description,
        h.image,
        h.price_per_day,
        h.capacity,
        h.created_at
       FROM halls h
       ORDER BY h.id DESC`
    );

    res.json({
      success: true,
      halls: result.rows,
    });

  } catch (error) {
    console.error("Get halls error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch halls.",
    });
  }
});

// =====================================================
// HALL - GET ONE
// =====================================================

app.get("/api/halls/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        h.*,
        u.name AS owner_name,
        u.phone AS owner_phone
       FROM halls h
       JOIN users u ON u.id = h.owner_id
       WHERE h.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found.",
      });
    }

    res.json({
      success: true,
      hall: result.rows[0],
    });

  } catch (error) {
    console.error("Get hall error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hall.",
    });
  }
});

// =====================================================
// OWNER - CREATE HALL
// =====================================================

app.post("/api/halls", async (req, res) => {
  try {
    const {
      ownerId,
      name,
      location,
      description,
      image,
      pricePerDay,
      capacity,
    } = req.body;

    if (
      !ownerId ||
      !name ||
      !location ||
      pricePerDay === undefined ||
      capacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required hall details are missing.",
      });
    }

    const owner = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'owner'",
      [ownerId]
    );

    if (owner.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner.",
      });
    }

    const result = await pool.query(
      `INSERT INTO halls
        (owner_id, name, location, description, image, price_per_day, capacity)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        ownerId,
        name,
        location,
        description || null,
        image || null,
        pricePerDay,
        capacity,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Hall created successfully.",
      hall: result.rows[0],
    });

  } catch (error) {
    console.error("Create hall error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create hall.",
    });
  }
});

// =====================================================
// AVAILABILITY CHECK
// =====================================================

app.get("/api/halls/:hallId/availability", async (req, res) => {
  try {
    const { hallId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required.",
      });
    }

    const result = await pool.query(
      `SELECT id
       FROM bookings
       WHERE hall_id = $1
         AND event_date = $2
         AND status IN ('Pending', 'Accepted')`,
      [hallId, date]
    );

    res.json({
      success: true,
      available: result.rows.length === 0,
      date,
    });

  } catch (error) {
    console.error("Availability error:", error);

    res.status(500).json({
      success: false,
      message: "Availability check failed.",
    });
  }
});

// =====================================================
// CREATE BOOKING
// =====================================================

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      hallId,
      customerId,
      eventDate,
      guests,
      eventType,
      customerName,
      customerPhone,
      customerEmail,
      specialRequirements,
    } = req.body;

    if (
      !hallId ||
      !customerId ||
      !eventDate ||
      !guests ||
      !eventType ||
      !customerName ||
      !customerPhone ||
      !customerEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "Required booking details are missing.",
      });
    }

    // Check hall
    const hallResult = await pool.query(
  "SELECT * FROM halls WHERE id = $1 AND is_active = TRUE",
  [hallId]
);
    if (hallResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found.",
      });
    }

    const hall = hallResult.rows[0];

    // Check capacity
    if (Number(guests) > Number(hall.capacity)) {
      return res.status(400).json({
        success: false,
        message: `This hall can accommodate up to ${hall.capacity} guests.`,
      });
    }

    // Check date
    const existingBooking = await pool.query(
      `SELECT id
       FROM bookings
       WHERE hall_id = $1
         AND event_date = $2
         AND status IN ('Pending', 'Accepted')`,
      [hallId, eventDate]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This hall is already requested for the selected date.",
      });
    }

    const bookingReference =
      "HM-" +
      Date.now().toString().slice(-8);

    const bookingResult = await pool.query(
      `INSERT INTO bookings
        (
          booking_reference,
          hall_id,
          customer_id,
          event_date,
          guests,
          event_type,
          customer_name,
          customer_phone,
          customer_email,
          special_requirements,
          price,
          status
        )
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'Pending')
       RETURNING *`,
      [
        bookingReference,
        hallId,
        customerId,
        eventDate,
        guests,
        eventType,
        customerName,
        customerPhone,
        customerEmail,
        specialRequirements || null,
        hall.price_per_day,
      ]
    );

    const booking = bookingResult.rows[0];

    // Notification for owner
    await pool.query(
      `INSERT INTO notifications
        (user_id, booking_id, title, message)
       VALUES
        ($1, $2, $3, $4)`,
      [
        hall.owner_id,
        booking.id,
        "New Booking Request",
        `${customerName} submitted a booking request for ${hall.name} on ${eventDate}.`,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      booking,
    });

  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking.",
    });
  }
});

// =====================================================
// CUSTOMER BOOKINGS
// =====================================================

app.get("/api/bookings/customer/:customerId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
  b.*,
  h.name AS hall_name,
  h.location AS hall_location,
  h.image AS hall_image,
  o.name AS owner_name,
  o.phone AS owner_phone,
  o.email AS owner_email
FROM bookings b
JOIN halls h ON h.id = b.hall_id
LEFT JOIN users o ON o.id = h.owner_id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [req.params.customerId]
    );

    res.json({
      success: true,
      bookings: result.rows,
    });

  } catch (error) {
    console.error("Customer bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
});

// =====================================================
// OWNER BOOKINGS
// =====================================================

app.get("/api/bookings/owner/:ownerId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        b.*,
        h.name AS hall_name,
        h.location AS hall_location
       FROM bookings b
       JOIN halls h ON h.id = b.hall_id
       WHERE h.owner_id = $1
       ORDER BY b.created_at DESC`,
      [req.params.ownerId]
    );

    res.json({
      success: true,
      bookings: result.rows,
    });

  } catch (error) {
    console.error("Owner bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch owner bookings.",
    });
  }
});

// =====================================================
// OWNER DASHBOARD
// =====================================================

app.get("/api/owner/:ownerId/dashboard", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const hallResult = await pool.query(
      `SELECT *
       FROM halls
       WHERE owner_id = $1
       ORDER BY id
       LIMIT 1`,
      [ownerId]
    );

    const statsResult = await pool.query(
  `SELECT
    COUNT(*)::int AS total_bookings,
    COUNT(*) FILTER (
      WHERE b.status = 'Pending'
    )::int AS pending_requests,
    COALESCE(
      SUM(p.amount) FILTER (
        WHERE p.status = 'Paid'
      ), 0
    ) AS total_revenue
   FROM bookings b
   JOIN halls h ON h.id = b.hall_id
   LEFT JOIN payments p ON p.booking_id = b.id
   WHERE h.owner_id = $1`,
  [ownerId]
);

    const monthResult = await pool.query(
  `SELECT
    COALESCE(SUM(p.amount), 0) AS monthly_revenue
   FROM payments p
   JOIN bookings b ON b.id = p.booking_id
   JOIN halls h ON h.id = b.hall_id
   WHERE h.owner_id = $1
     AND p.status = 'Paid'
     AND DATE_TRUNC('month', p.paid_at)
         = DATE_TRUNC('month', CURRENT_TIMESTAMP)`,
  [ownerId]
);
    const recentResult = await pool.query(
      `SELECT
        b.id,
        b.booking_reference,
        b.customer_name,
        b.event_date,
        b.guests,
        b.event_type,
        b.price,
        b.status,
        h.name AS hall_name
       FROM bookings b
       JOIN halls h ON h.id = b.hall_id
       WHERE h.owner_id = $1
       ORDER BY b.created_at DESC
       LIMIT 5`,
      [ownerId]
    );

    res.json({
      success: true,

      hall: hallResult.rows[0] || null,

      stats: {
        totalBookings:
          statsResult.rows[0].total_bookings,
        pendingRequests:
          statsResult.rows[0].pending_requests,
        totalRevenue:
          statsResult.rows[0].total_revenue,
        monthlyRevenue:
          monthResult.rows[0].monthly_revenue,
      },

      recentBookings: recentResult.rows,
    });

  } catch (error) {
    console.error("Owner dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load owner dashboard.",
    });
  }
});

// =====================================================
// OWNER ACCEPT / REJECT BOOKING
// =====================================================

app.patch("/api/bookings/:bookingId/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const bookingResult = await pool.query(
      `SELECT
        b.*,
        h.name AS hall_name,
        h.owner_id
       FROM bookings b
       JOIN halls h ON h.id = b.hall_id
       WHERE b.id = $1`,
      [req.params.bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const booking = bookingResult.rows[0];

    const updatedResult = await pool.query(
      `UPDATE bookings
       SET
         status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, req.params.bookingId]
    );

    const title =
      status === "Accepted"
        ? "Booking Accepted"
        : status === "Rejected"
        ? "Booking Rejected"
        : "Booking Cancelled";

    const message =
      status === "Accepted"
        ? `Your booking for ${booking.hall_name} on ${booking.event_date} has been accepted.`
        : status === "Rejected"
        ? `Your booking request for ${booking.hall_name} on ${booking.event_date} was rejected.`
        : `Your booking for ${booking.hall_name} on ${booking.event_date} was cancelled.`;

    await pool.query(
      `INSERT INTO notifications
        (user_id, booking_id, title, message)
       VALUES
        ($1, $2, $3, $4)`,
      [
        booking.customer_id,
        booking.id,
        title,
        message,
      ]
    );

    res.json({
      success: true,
      message: `Booking ${status.toLowerCase()}.`,
      booking: updatedResult.rows[0],
    });

  } catch (error) {
    console.error("Booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking.",
    });
  }
});

// =====================================================
// CUSTOMER NOTIFICATIONS
// =====================================================

app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.params.userId]
    );

    res.json({
      success: true,
      notifications: result.rows,
    });

  } catch (error) {
    console.error("Notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
});

// =====================================================
// MARK NOTIFICATION AS READ
// =====================================================

app.patch("/api/notifications/:id/read", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    res.json({
      success: true,
      notification: result.rows[0],
    });

  } catch (error) {
    console.error("Notification read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
});
// ===============================
// GET ALL HALLS
// ===============================

app.get("/api/halls", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.id,
        h.name,
        h.location,
        h.description,
        h.image,
        h.price_per_day,
        h.capacity,
        h.owner_id,
        u.name AS owner_name
      FROM halls h
      LEFT JOIN users u
        ON h.owner_id = u.id
      ORDER BY h.id;
    `);

    res.json({
      success: true,
      halls: result.rows,
    });
  } catch (error) {
    console.error("Error fetching halls:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch halls.",
    });
  }
});
// =====================================================
// CUSTOMER PAYMENT
// =====================================================

app.post("/api/payments", async (req, res) => {
  try {
    const {
      bookingId,
      paymentMethod,
    } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and payment method are required.",
      });
    }

    // -------------------------------------------------
    // Find booking
    // -------------------------------------------------
    const bookingResult = await pool.query(
      `SELECT
        b.*,
        h.name AS hall_name,
        h.owner_id
       FROM bookings b
       JOIN halls h ON h.id = b.hall_id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const booking = bookingResult.rows[0];

    // -------------------------------------------------
    // Payment is allowed only after owner acceptance
    // -------------------------------------------------
    if (booking.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Payment can only be completed after the booking is accepted.",
      });
    }

    // -------------------------------------------------
    // Check whether payment already exists
    // -------------------------------------------------
    const existingPayment = await pool.query(
      `SELECT *
       FROM payments
       WHERE booking_id = $1
         AND status = 'Paid'
       LIMIT 1`,
      [bookingId]
    );

    if (existingPayment.rows.length > 0) {
      return res.json({
        success: true,
        message: "Payment already completed.",
        payment: existingPayment.rows[0],
      });
    }

    // -------------------------------------------------
    // Generate payment reference
    // -------------------------------------------------
    const paymentReference =
      "PAY-" + Date.now().toString().slice(-8);

    // -------------------------------------------------
    // Save payment
    // -------------------------------------------------
    const paymentResult = await pool.query(
      `INSERT INTO payments
        (
          booking_id,
          payment_reference,
          amount,
          payment_method,
          status
        )
       VALUES
        ($1, $2, $3, $4, 'Paid')
       RETURNING *`,
      [
        bookingId,
        paymentReference,
        booking.price,
        paymentMethod,
      ]
    );

    const payment = paymentResult.rows[0];

    // -------------------------------------------------
    // Notify customer
    // -------------------------------------------------
    await pool.query(
      `INSERT INTO notifications
        (user_id, booking_id, title, message)
       VALUES
        ($1, $2, $3, $4)`,
      [
        booking.customer_id,
        booking.id,
        "Payment Successful",
        `Your payment of ₹${Number(
          booking.price
        ).toLocaleString("en-IN")} for ${booking.hall_name} has been recorded successfully.`,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Payment completed successfully.",
      payment,
    });

  } catch (error) {
    console.error("Payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process payment.",
    });
  }
});
// =====================================================
// ADMIN APIs
// =====================================================

// -----------------------------------------------------
// ADMIN AUTHORIZATION
// -----------------------------------------------------
async function requireAdmin(req, res, next) {
  try {
    const adminId = Number(req.headers["x-user-id"]);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE id = $1 AND role = 'admin'`,
      [adminId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied.",
      });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify admin access.",
    });
  }
}


// -----------------------------------------------------
// ADMIN DASHBOARD
// -----------------------------------------------------
app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const usersResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM users
       WHERE role = 'customer'`
    );

    const ownersResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM users
       WHERE role = 'owner'`
    );

    const hallsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM halls`
    );

    const bookingsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM bookings`
    );

    const pendingResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM bookings
       WHERE status = 'Pending'`
    );

    const acceptedResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM bookings
       WHERE status = 'Accepted'`
    );

    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0)::numeric AS revenue
       FROM payments
       WHERE status = 'Paid'`
    );

    const recentBookingsResult = await pool.query(
      `SELECT
         b.id,
         b.booking_reference,
         b.event_date,
         b.event_type,
         b.guests,
         b.price,
         b.status,
         b.payment_status,
         b.created_at,
         b.customer_name,
         h.name AS hall_name,
         h.location AS hall_location
       FROM bookings b
       JOIN halls h ON h.id = b.hall_id
       ORDER BY b.created_at DESC
       LIMIT 8`
    );

    res.json({
      success: true,
      stats: {
        users: Number(usersResult.rows[0].count),
        owners: Number(ownersResult.rows[0].count),
        halls: Number(hallsResult.rows[0].count),
        bookings: Number(bookingsResult.rows[0].count),
        pendingBookings: Number(pendingResult.rows[0].count),
        acceptedBookings: Number(acceptedResult.rows[0].count),
        revenue: Number(revenueResult.rows[0].revenue),
      },
      recentBookings: recentBookingsResult.rows,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard.",
    });
  }
});


// -----------------------------------------------------
// ADMIN - USERS
// -----------------------------------------------------
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
  id,
  name,
  email,
  phone,
  role,
  notifications_enabled,
  is_blocked,
  created_at
FROM users
       WHERE role IN ('customer', 'owner')
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load users.",
    });
  }
});


// -----------------------------------------------------
// ADMIN - HALLS
// -----------------------------------------------------
app.get("/api/admin/halls", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         h.id,
         h.name,
         h.location,
         h.description,
         h.image,
         h.price_per_day,
         h.capacity,
         h.is_active,
         h.created_at,
         u.id AS owner_id,
         u.name AS owner_name,
         u.email AS owner_email
       FROM halls h
       JOIN users u ON u.id = h.owner_id
       ORDER BY h.created_at DESC`
    );

    res.json({
      success: true,
      halls: result.rows,
    });
  } catch (error) {
    console.error("Admin halls error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load halls.",
    });
  }
});


// -----------------------------------------------------
// ADMIN - BOOKINGS
// -----------------------------------------------------
app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         b.id,
         b.booking_reference,
         b.event_date,
         b.guests,
         b.event_type,
         b.customer_name,
         b.customer_phone,
         b.customer_email,
         b.special_requirements,
         b.price,
         b.status,
         b.payment_status,
         b.payment_method,
         b.paid_at,
         b.transaction_reference,
         b.created_at,
         b.updated_at,

         h.name AS hall_name,
         h.location AS hall_location,

         owner.name AS owner_name,
         owner.email AS owner_email,

         customer.id AS customer_id

       FROM bookings b

       JOIN halls h
         ON h.id = b.hall_id

       JOIN users owner
         ON owner.id = h.owner_id

       JOIN users customer
         ON customer.id = b.customer_id

       ORDER BY b.created_at DESC`
    );

    res.json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load bookings.",
    });
  }
});


// -----------------------------------------------------
// ADMIN - PAYMENTS
// -----------------------------------------------------
app.get("/api/admin/payments", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         p.id,
         p.payment_reference,
         p.amount,
         p.payment_method,
         p.status,
         p.paid_at,

         b.booking_reference,
         b.event_date,

         h.name AS hall_name,
         h.location AS hall_location,

         customer.name AS customer_name,
         customer.email AS customer_email,

         owner.name AS owner_name

       FROM payments p

       JOIN bookings b
         ON b.id = p.booking_id

       JOIN halls h
         ON h.id = b.hall_id

       JOIN users customer
         ON customer.id = b.customer_id

       JOIN users owner
         ON owner.id = h.owner_id

       ORDER BY p.paid_at DESC`
    );

    res.json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.error("Admin payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load payments.",
    });
  }
});
// =====================================================
// ADMIN - BLOCK / UNBLOCK USER
// =====================================================
app.patch("/api/admin/users/:id/block", requireAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { blocked } = req.body;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET is_blocked = $1
       WHERE id = $2
         AND role IN ('customer', 'owner')
       RETURNING id, name, email, role, is_blocked`,
      [Boolean(blocked), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: blocked
        ? "User blocked successfully."
        : "User unblocked successfully.",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Admin block user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
});


// =====================================================
// ADMIN - ENABLE / DISABLE HALL
// =====================================================
app.patch("/api/admin/halls/:id/status", requireAdmin, async (req, res) => {
  try {
    const hallId = Number(req.params.id);
    const { active } = req.body;

    if (!Number.isInteger(hallId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hall ID.",
      });
    }

    const result = await pool.query(
      `UPDATE halls
       SET is_active = $1
       WHERE id = $2
       RETURNING *`,
      [Boolean(active), hallId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found.",
      });
    }

    res.json({
      success: true,
      message: active
        ? "Hall enabled successfully."
        : "Hall disabled successfully.",
      hall: result.rows[0],
    });

  } catch (error) {
    console.error("Admin hall status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update hall status.",
    });
  }
});
// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HallMate running on port ${PORT}`);
});