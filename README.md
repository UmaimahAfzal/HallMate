# HallMate – Smart Hall Booking System

HallMate is a web-based Smart Hall Booking System designed to simplify the process of discovering, checking, and booking event halls.

Instead of depending on phone calls, paper records, or fragmented communication, HallMate provides a centralized platform connecting customers, hall owners, and administrators.

## Problem

Traditional hall booking can involve:

- Phone-based enquiries
- Manual availability checking
- Unclear booking status
- Risk of overlapping booking requests
- Difficulty managing customer requests
- Limited visibility for hall owners and administrators

## Solution

HallMate brings the complete booking workflow into one system:

**Discover → Check Availability → Request Booking → Owner Confirmation → Payment → Notifications → Track Booking**

## User Roles

### Customer

Customers can:

- Register and sign in
- Search and filter halls
- Search by location, date, and event type
- View hall details, gallery, capacity, pricing, and amenities
- Check hall availability
- Submit booking requests
- Track booking status
- Proceed to payment after owner acceptance
- Receive notifications
- View booking history
- Manage profile and settings
- Use the Smart Venue Assistant
- Mark halls as favourites directly from hall cards

### Hall Owner

Owners can:

- Register and sign in
- Access the owner dashboard
- List halls
- Manage hall information
- Manage hall availability
- View customer booking requests
- Accept or reject booking requests
- Receive notifications
- View booking and dashboard information
- Manage owner profile

### Administrator

The administrator provides centralized platform management.

Admin features include:

- Dashboard overview
- User and owner management
- Hall management
- Booking monitoring
- Payment record monitoring
- Block or unblock users
- Enable or disable halls

## Key Features

### Smart Hall Discovery

Customers can discover halls using:

- Location
- Event type
- Event date
- Capacity
- Price
- Hall details
- Amenities
- Gallery

### Availability Checking

The backend checks existing booking records for the selected hall and date.

Pending and Accepted bookings are considered during availability checking to reduce conflicting booking requests.

### Booking Workflow

A customer submits a booking request with information such as:

- Event date
- Number of guests
- Event type
- Name
- Phone
- Email

The booking is initially created with **Pending** status.

The owner can then:

**Pending → Accepted**

or

**Pending → Rejected**

### Notifications

Notifications keep customers and owners informed about important events.

Examples:

- New booking request
- Booking accepted
- Booking rejected
- Payment successfully recorded

Notifications also maintain a read/unread state.

### Payment Workflow

Payment is connected to the booking status.

Payment can proceed after the booking has been accepted.

The current hackathon implementation records payment information at the application/backend level. A production payment gateway can be integrated as a future enhancement.

### Smart Venue Assistant

HallMate includes a Smart Venue Assistant that helps users move from their requirements toward suitable hall discovery.

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
- bcrypt
- CORS

### Database

- PostgreSQL

### Development Tools

- Visual Studio Code
- Git
- GitHub

## System Architecture

```text
                HALLMATE
                    │
        ┌───────────┼───────────┐
        │           │           │
     Customer      Owner       Admin
        │           │           │
        └───────────┼───────────┘
                    ↓
             React Frontend
                    ↓
              HTTP / REST API
                    ↓
           Node.js + Express
                    ↓
              PostgreSQL
