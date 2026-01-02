# RoomSync - Room Reservation and Facility Booking Portal

A modern, full-featured hotel management and booking portal built with React.js. This front-end application provides three distinct user interfaces for Admin, Staff, and Customer roles.

## Features

### 🎯 Core Functionality
- **Three Role-Based Dashboards**: Admin, Staff, and Customer
- **Room Search & Booking**: Browse available rooms with filters
- **Payment Simulation**: Secure payment flow with modal popup
- **Booking Management**: View and manage reservations
- **Room Management**: Real-time room status updates
- **Check-in/Check-out**: Streamlined guest management
- **Reviews & Feedback**: Customer review system
- **Analytics & Reports**: Revenue and occupancy tracking

### 👥 User Roles

#### Admin Dashboard
- Dashboard overview with key metrics
- User management (view, activate/deactivate)
- Room management (add, edit, update status)
- Reports & analytics (revenue, occupancy, bookings)

#### Staff Dashboard
- Check-in/Check-out management
- Room status management
- Booking management and monitoring

#### Customer Dashboard
- Room search with filters (date, category, price)
- Booking creation and management
- Payment processing (simulated)
- Profile management
- Reviews and feedback submission

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd FS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Login
1. Navigate to the login page
2. Enter any email and password (no validation required for demo)
3. Select your role:
   - **Customer**: Access customer booking features
   - **Staff**: Access staff management tools
   - **Admin**: Access admin dashboard and controls
4. Click "Login"

### Making a Booking (Customer)
1. Select check-in and check-out dates
2. Use filters to find desired rooms
3. Click "Book Now" on a room
4. Fill in payment details in the modal
5. Click "Pay" - a success popup will appear confirming payment

### Managing Bookings (Staff)
1. Go to "Check-In / Check-Out" tab
2. View pending bookings ready for check-in
3. Click "Check In" or "Check Out" buttons
4. Room status updates automatically

### Admin Functions
1. **Overview**: View revenue, occupancy, and key metrics
2. **User Management**: Search and manage user accounts
3. **Room Management**: View and update room statuses
4. **Reports**: Access detailed analytics and reports

## Project Structure

```
roomsync/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   ├── Dashboards/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── CustomerDashboard.js
│   │   │   ├── StaffDashboard.js
│   │   │   └── Dashboard.css
│   │   ├── Rooms/
│   │   │   ├── RoomSearch.js
│   │   │   ├── RoomCard.js
│   │   │   └── ...
│   │   ├── Payment/
│   │   │   ├── PaymentModal.js
│   │   │   └── PaymentModal.css
│   │   ├── Bookings/
│   │   ├── Admin/
│   │   ├── Staff/
│   │   ├── Profile/
│   │   └── Reviews/
│   ├── data/
│   │   └── mockData.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Payment Simulation

The payment system is fully simulated:
1. User enters card details (card number, name, expiry, CVV)
2. Clicks "Pay" button
3. Shows processing animation
4. Displays success confirmation popup
5. Updates booking status to "confirmed"

**Note**: No actual payment processing occurs. This is a front-end demo only.

## Technologies Used

- **React.js**: UI framework
- **React Router**: Navigation and routing
- **CSS3**: Styling with modern design patterns
- **Local Storage**: Session management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Demo Data

The application comes with pre-loaded mock data:
- 6 sample rooms (various categories and statuses)
- Sample bookings
- Sample users

## Features Overview

### Responsive Design
- Mobile-friendly layouts
- Adaptive grid systems
- Touch-optimized interactions

### Modern UI/UX
- Gradient backgrounds
- Smooth animations
- Intuitive navigation
- Color-coded status indicators

## Notes

- This is a **front-end only** application
- No backend integration
- Data persists in browser local storage during session
- All bookings and changes are local to the browser

## Future Enhancements

- Backend API integration
- Real payment gateway integration
- Email notifications
- Image uploads for rooms
- Advanced reporting features
- Multi-language support

## License

This project is created for educational purposes.

## Authors

- Aeman Aasim - 232384
- Maheen Fatim - 232538
- Dua Imran - 220972

---

**RoomSync** - Streamlining hotel operations, one booking at a time! 🏨✨

