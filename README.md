# 🏨 RoomSync - Hotel Management System

**RoomSync** is a full-stack Hotel Management & Booking System built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features a complex booking engine supporting both private rooms and shared dormitories, a dynamic VIP tier system, and a comprehensive Staff Portal for real-time hotel operations.

---

## 🚀 Key Features

### 👤 **Customer Portal**

* **Smart Room Search:** Filter by dates, price range, and room type.
* **Shared Dorm Logic:** Book individual beds in shared rooms. The system automatically tracks bed availability.
* **VIP System:** Wealth-based tier system. Users with wealth > $50k automatically unlock exclusive rooms (e.g., Presidential Suite) invisible to standard users.
* **Booking History:** View past and upcoming stays.

### 🛎️ **Staff Portal**

* **Check-In / Check-Out:** Dashboard to handle guest arrivals and departures in real-time.
* **Housekeeping Status:** Mark rooms as "Maintenance", "Dirty", or "Available" instantly.
* **Live Updates:** Changes in room status immediately reflect on the customer booking side.

### 🛡️ **Admin Dashboard**

* **Analytics:** View total revenue, occupancy rates, and user stats.
* **User Management:** Promote/demote users and manage staff roles.
* **Room Management:** Add, edit, or delete rooms and amenities.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** Custom Auth (Login/Signup with Role-based Access)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/duaaimran83/Hotel-management-system
cd roomsync

```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` folder and add your MongoDB connection string:

```env
MONGO_URI='mongodb+srv://adminfswd:fswdproject@trycluster0.rawptfn.mongodb.net/RoomSync?appName=TryCluster0'
PORT=5000

```


Start the Backend Server:

```bash
node server.js

```

### 4. Frontend Setup

Open a new terminal, navigate to the frontend folder, and start the React app:

```bash
cd frontend
npm install
npm start

```

The app should now be running at `http://localhost:3000`.

---

## 🔑 Demo Credentials

Use these accounts to test different features of the application:

| Role | Email | Password | Features to Test |
| --- | --- | --- | --- |
| **VIP Customer** | `ali@vip.com` | `123` | Can see & book the **VIP Penthouse**. |
| **Student** | `aeman@student.com` | `123` | Can only see Standard/Shared rooms. Currently checked into Room 101. |
| **Traveler** | `maheen@traveler.com` | `123` | Arriving today. Use this account to test **Check-In**. |
| **Staff** | `staff@roomsync.com` | `123` | Access **Staff Portal** to check guests in/out & manage room status. |
| **Admin** | `admin@roomsync.com` | `123` | Access **Admin Dashboard** for analytics. |

---

## 📸 Screenshots

### 1. Smart Search & VIP Filtering

*Automatic filtering of luxury suites based on user wealth.*

### 2. Shared Dorm Booking

*Smart bed counting logic prevents overbooking of shared spaces.*

### 3. Staff Dashboard

*Real-time Check-in/Check-out and Housekeeping controls.*

---

## 👨‍💻 Contributors

* Aeman Aasim - 232384
* Maheen Fatima - 232528
* Duaa Imran - 220972

---

## 📄 License

This project is licensed under the MIT License.