export const mockRooms = [
  {
    id: '1',
    name: 'Deluxe Suite',
    category: 'suite',
    capacity: 4,
    beds: 2,
    price: 250,
    status: 'available',
    isVIP: false,
    image: '/images/1.jfif',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony']
  },
  {
    id: '2',
    name: 'Standard Room',
    category: 'standard',
    capacity: 2,
    beds: 1,
    price: 80,
    status: 'available',
    isVIP: false,
    image: '/images/2.jpg',
    amenities: ['WiFi', 'TV', 'Air Conditioning']
  },
  {
    id: '3',
    name: 'Executive Suite',
    category: 'suite',
    capacity: 6,
    beds: 3,
    price: 350,
    status: 'available',
    isVIP: false,
    image: '/images/3.jpg',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Jacuzzi']
  },
  {
    id: '4',
    name: 'Deluxe Room',
    category: 'deluxe',
    capacity: 3,
    beds: 2,
    price: 150,
    status: 'occupied',
    isVIP: false,
    image: '/images/4.jfif',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning']
  },
  {
    id: '5',
    name: 'Family Room',
    category: 'standard',
    capacity: 5,
    beds: 2,
    price: 120,
    status: 'available',
    isVIP: false,
    image: '/images/5.png',
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Extra Bed']
  },
  {
    id: '10',
    name: 'Single Room',
    category: 'single',
    capacity: 1,
    beds: 1,
    price: 50,
    status: 'available',
    isVIP: false,
    image: '/images/4.jfif',
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom']
  },
  {
    id: '11',
    name: 'Double Room',
    category: 'double',
    capacity: 2,
    beds: 1,
    price: 75,
    status: 'available',
    isVIP: false,
    image: '/images/2.jpg',
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Double Bed', 'Private Bathroom']
  },
  {
    id: '12',
    name: 'Shared Room',
    category: 'shared',
    capacity: 4,
    beds: 4,
    price: 30,
    status: 'available',
    isVIP: false,
    image: '/images/6.jfif',
    amenities: ['WiFi', 'Air Conditioning', 'Shared Bathroom', 'Lockers', 'Common Area Access']
  },
  {
    id: '6',
    name: 'Presidential Suite',
    category: 'suite',
    capacity: 8,
    beds: 4,
    price: 500,
    status: 'maintenance',
    isVIP: true,
    image: '/images/6.jfif',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Jacuzzi', 'Kitchen']
  },
  {
    id: '7',
    name: 'VIP Royal Suite',
    category: 'vip',
    capacity: 6,
    beds: 3,
    price: 800,
    status: 'available',
    isVIP: true,
    image: '/images/1.jfif',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Jacuzzi', 'Private Butler', 'Champagne Service', 'Concierge']
  },
  {
    id: '8',
    name: 'VIP Diamond Penthouse',
    category: 'vip',
    capacity: 10,
    beds: 5,
    price: 1200,
    status: 'available',
    isVIP: true,
    image: '/images/2.jpg',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Jacuzzi', 'Private Butler', 'Champagne Service', 'Concierge', 'Private Elevator', 'Rooftop Terrace', 'Wine Cellar']
  },
  {
    id: '9',
    name: 'VIP Platinum Suite',
    category: 'vip',
    capacity: 4,
    beds: 2,
    price: 600,
    status: 'available',
    isVIP: true,
    image: '/images/3.jpg',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Jacuzzi', 'Private Butler', 'Champagne Service']
  }
];

// VIP Wealth Threshold
export const VIP_WEALTH_THRESHOLD = 10000;

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    wealth: 5000,
    isVIP: false
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    status: 'active',
    wealth: 15000,
    isVIP: true
  },
  {
    id: '3',
    name: 'Manager User',
    email: 'manager@hotel.com',
    role: 'staff',
    status: 'active',
    wealth: 0,
    isVIP: false
  }
];

export const mockBookings = [
  {
    id: '1',
    roomId: '4',
    roomName: 'Deluxe Room',
    checkIn: '2024-12-01',
    checkOut: '2024-12-05',
    totalAmount: 600,
    status: 'confirmed',
    userId: '1',
    createdAt: '2024-11-25T10:00:00Z',
    paymentDetails: {
      cardNumber: '1234567890123456',
      cardName: 'JOHN DOE',
      expiryDate: '12/25',
      cvv: '123',
      amount: 600
    }
  },
  {
    id: '2',
    roomId: '2',
    roomName: 'Standard Room',
    checkIn: '2024-12-10',
    checkOut: '2024-12-12',
    totalAmount: 160,
    status: 'pending',
    userId: '2',
    createdAt: '2024-11-28T14:00:00Z'
  }
];

// Conference Rooms - VIP only (2 can be booked)
export const mockConferenceRoomsVIP = [
  {
    id: 'cr-vip-1',
    name: 'Executive Conference Room A',
    type: 'conference-room',
    capacity: 20,
    price: 500,
    status: 'available',
    isVIP: true,
    amenities: ['Projector', 'WiFi', 'Whiteboard', 'Video Conferencing', 'Catering Service']
  },
  {
    id: 'cr-vip-2',
    name: 'Executive Conference Room B',
    type: 'conference-room',
    capacity: 25,
    price: 600,
    status: 'available',
    isVIP: true,
    amenities: ['Projector', 'WiFi', 'Whiteboard', 'Video Conferencing', 'Catering Service', 'Sound System']
  },
  {
    id: 'cr-vip-3',
    name: 'Boardroom Elite',
    type: 'conference-room',
    capacity: 15,
    price: 450,
    status: 'available',
    isVIP: true,
    amenities: ['Projector', 'WiFi', 'Whiteboard', 'Video Conferencing', 'Premium Seating']
  }
];

// Halls - VIP only (1 can be booked, capacity-based matching)
export const mockHallsVIP = [
  {
    id: 'hall-vip-1',
    name: 'Grand Ballroom',
    type: 'hall',
    capacity: 200,
    price: 2000,
    status: 'available',
    isVIP: true,
    amenities: ['Stage', 'Sound System', 'Lighting', 'Catering', 'WiFi', 'Parking']
  },
  {
    id: 'hall-vip-2',
    name: 'Royal Hall',
    type: 'hall',
    capacity: 150,
    price: 1800,
    status: 'available',
    isVIP: true,
    amenities: ['Stage', 'Sound System', 'Lighting', 'Catering', 'WiFi', 'VIP Lounge']
  },
  {
    id: 'hall-vip-3',
    name: 'Diamond Event Hall',
    type: 'hall',
    capacity: 300,
    price: 2500,
    status: 'available',
    isVIP: true,
    amenities: ['Stage', 'Sound System', 'Lighting', 'Catering', 'WiFi', 'Parking', 'VIP Lounge', 'Bar']
  },
  {
    id: 'hall-vip-4',
    name: 'Platinum Conference Hall',
    type: 'hall',
    capacity: 100,
    price: 1500,
    status: 'available',
    isVIP: true,
    amenities: ['Stage', 'Sound System', 'Lighting', 'Catering', 'WiFi']
  },
  {
    id: 'hall-vip-5',
    name: 'Elite Banquet Hall',
    type: 'hall',
    capacity: 250,
    price: 2200,
    status: 'available',
    isVIP: true,
    amenities: ['Stage', 'Sound System', 'Lighting', 'Catering', 'WiFi', 'Parking', 'Bar']
  }
];

// Conference Rooms - Regular customers
export const mockConferenceRoomsRegular = [
  {
    id: 'cr-reg-1',
    name: 'Business Conference Room',
    type: 'conference-room',
    capacity: 30,
    price: 300,
    status: 'available',
    isVIP: false,
    amenities: ['Projector', 'WiFi', 'Whiteboard', 'Video Conferencing']
  },
  {
    id: 'cr-reg-2',
    name: 'Standard Meeting Room',
    type: 'conference-room',
    capacity: 15,
    price: 200,
    status: 'available',
    isVIP: false,
    amenities: ['Projector', 'WiFi', 'Whiteboard']
  },
  {
    id: 'cr-reg-3',
    name: 'Corporate Conference Room',
    type: 'conference-room',
    capacity: 40,
    price: 350,
    status: 'available',
    isVIP: false,
    amenities: ['Projector', 'WiFi', 'Whiteboard', 'Video Conferencing', 'Sound System']
  }
];

// Halls - Regular customers
export const mockHallsRegular = [
  {
    id: 'hall-reg-1',
    name: 'Event Hall A',
    type: 'hall',
    capacity: 100,
    price: 800,
    status: 'available',
    isVIP: false,
    amenities: ['Stage', 'Sound System', 'Lighting', 'WiFi']
  },
  {
    id: 'hall-reg-2',
    name: 'Banquet Hall',
    type: 'hall',
    capacity: 150,
    price: 1000,
    status: 'available',
    isVIP: false,
    amenities: ['Stage', 'Sound System', 'Lighting', 'Catering', 'WiFi']
  },
  {
    id: 'hall-reg-3',
    name: 'Celebration Hall',
    type: 'hall',
    capacity: 80,
    price: 700,
    status: 'available',
    isVIP: false,
    amenities: ['Stage', 'Sound System', 'Lighting', 'WiFi']
  },
  {
    id: 'hall-reg-4',
    name: 'Community Hall',
    type: 'hall',
    capacity: 120,
    price: 900,
    status: 'available',
    isVIP: false,
    amenities: ['Stage', 'Sound System', 'Lighting', 'WiFi', 'Parking']
  }
];

