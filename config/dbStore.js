const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Pre-seeded in-memory collections for resilient local execution without a live MongoDB instance
const inMemoryPlayers = [
  {
    _id: 'ply_001',
    id: 'ply_001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@nupl.com',
    description: 'Right-handed Top Order Batsman & Athletic Fielder',
    profilepic: '1a219fbc0ec7d5cb64507c27.jpg',
    auction: 'nupl cricket'
  },
  {
    _id: 'ply_002',
    id: 'ply_002',
    name: 'Rohan Verma',
    email: 'rohan.verma@nupl.com',
    description: 'Right-arm Fast Bowler (Express Pace 140+ km/h)',
    profilepic: '1b0ca73591429759aa531cbc.jpg',
    auction: 'nupl cricket'
  },
  {
    _id: 'ply_003',
    id: 'ply_003',
    name: 'Karan Patel',
    email: 'karan.patel@nupl.com',
    description: 'Spin All-Rounder & Middle-Order Finisher',
    profilepic: '37934a32241a0e3b0460fe66.jpg',
    auction: 'nupl cricket'
  },
  {
    _id: 'ply_004',
    id: 'ply_004',
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@impetus.com',
    description: 'Grandmaster Strategist & Lead Gaming Tactician',
    profilepic: '536c44f94de316d1715ddcc6.jpg',
    auction: 'impetus'
  },
  {
    _id: 'ply_005',
    id: 'ply_005',
    name: 'Aditya Mehta',
    email: 'aditya.mehta@impetus.com',
    description: 'High-speed Analytical Problem Solver & Esports Lead',
    profilepic: '613ff6ab95079692e9cab912.jpg',
    auction: 'impetus'
  },
  {
    _id: 'ply_006',
    id: 'ply_006',
    name: 'Mateo Silva',
    email: 'mateo.silva@futsal.com',
    description: 'Dynamic Pivot Forward & Precision Finisher',
    profilepic: '63ea9e19c6a51dc35206ccf2.jpg',
    auction: 'futsal'
  },
  {
    _id: 'ply_007',
    id: 'ply_007',
    name: 'Devendra Joshi',
    email: 'devendra.joshi@futsal.com',
    description: 'Elite Goalkeeper with rapid reflexes and shot stopping',
    profilepic: '64a59f6999b9bcc6333406fb.jpg',
    auction: 'futsal'
  },
  {
    _id: 'ply_008',
    id: 'ply_008',
    name: 'Suraj Yadav',
    email: 'suraj.yadav@nukl.com',
    description: 'Iron Corner Defender with formidable ankle holds',
    profilepic: '691852416db97c593fb80b44.jpg',
    auction: 'nukl kabbadi'
  },
  {
    _id: 'ply_009',
    id: 'ply_009',
    name: 'Manpreet Singh',
    email: 'manpreet.singh@nukl.com',
    description: 'Agile Power Raider specializing in multi-point toe-touches',
    profilepic: '738827757bbed88e1be8e9ec.jpg',
    auction: 'nukl kabbadi'
  }
];

const inMemoryHosts = [
  {
    _id: 'host_001',
    id: 'host_001',
    hostname: 'League Commissioner',
    email: 'host@auction.com',
    password: '$2b$10$iIZb6uAKv6BfDr9DJj7yguMQEWc6ByHRGIuOS2HR1qETw/1GVfdAq', // HostPass123!
    profilepic: '0b9008feb2b40826fd553b66.png'
  }
];

const inMemoryUsers = [
  {
    _id: 'usr_001',
    id: 'usr_001',
    username: 'Apex Titans',
    email: 'apex@nupl.com',
    password: '$2b$10$bGEm541I9rBYt2jZA9x3vu.IlXraNCFLr6JtzCLIaDxLbyAcddWnO', // Franchise123!
    profilepic: '14840e22c80a1a8cc1be9e77.png',
    auctions: [
      { auction: 'nupl', budget: 1500000 },
      { auction: 'impetus', budget: 1000000 },
      { auction: 'futsal', budget: 850000 },
      { auction: 'nukl', budget: 900000 }
    ],
    players: [inMemoryPlayers[0]], // starts with Aarav Sharma
    save: async function () { return this; }
  },
  {
    _id: 'usr_002',
    id: 'usr_002',
    username: 'Royal Strikers',
    email: 'strikers@nupl.com',
    password: '$2b$10$bGEm541I9rBYt2jZA9x3vu.IlXraNCFLr6JtzCLIaDxLbyAcddWnO', // Franchise123!
    profilepic: '4abedcd1fb78e57fb7223e54.png',
    auctions: [
      { auction: 'nupl', budget: 1800000 },
      { auction: 'impetus', budget: 1200000 },
      { auction: 'futsal', budget: 950000 },
      { auction: 'nukl', budget: 1100000 }
    ],
    players: [],
    save: async function () { return this; }
  }
];

module.exports = {
  isDbConnected,
  inMemoryPlayers,
  inMemoryHosts,
  inMemoryUsers
};
