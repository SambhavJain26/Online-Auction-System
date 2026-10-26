const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Pre-seeded in-memory collections with sanitized sample athlete names & vector avatars
const inMemoryPlayers = [
  {
    _id: 'ply_001',
    id: 'ply_001',
    name: 'Alex Sterling',
    email: 'alex.sterling@sample-league.com',
    description: 'Right-handed Top Order Batsman & Captain',
    profilepic: 'cricket_01.png',
    auction: 'nupl cricket'
  },
  {
    _id: 'ply_002',
    id: 'ply_002',
    name: 'Liam Vance',
    email: 'liam.vance@sample-league.com',
    description: 'Right-arm Express Fast Bowler (145+ km/h)',
    profilepic: 'cricket_02.png',
    auction: 'nupl cricket'
  },
  {
    _id: 'ply_003',
    id: 'ply_003',
    name: 'Jordan Cole',
    email: 'jordan.cole@sample-league.com',
    description: 'Spin All-Rounder & Middle-Order Finisher',
    profilepic: 'cricket_03.png',
    auction: 'nupl cricket'
  },
  {
    _id: 'ply_004',
    id: 'ply_004',
    name: 'Marcus Chen',
    email: 'marcus.chen@sample-league.com',
    description: 'Grandmaster Strategist & Gaming Tactician',
    profilepic: 'esports_01.png',
    auction: 'impetus'
  },
  {
    _id: 'ply_005',
    id: 'ply_005',
    name: 'Tyler Brooks',
    email: 'tyler.brooks@sample-league.com',
    description: 'Analytical Problem Solver & Esports Lead',
    profilepic: 'esports_02.png',
    auction: 'impetus'
  },
  {
    _id: 'ply_006',
    id: 'ply_006',
    name: 'Lucas Silva',
    email: 'lucas.silva@sample-league.com',
    description: 'Dynamic Pivot Forward & Precision Finisher',
    profilepic: 'futsal_01.png',
    auction: 'futsal'
  },
  {
    _id: 'ply_007',
    id: 'ply_007',
    name: 'David Miller',
    email: 'david.miller@sample-league.com',
    description: 'Elite Goalkeeper with rapid reflexes & shot stopping',
    profilepic: 'futsal_02.png',
    auction: 'futsal'
  },
  {
    _id: 'ply_008',
    id: 'ply_008',
    name: 'Vikram Thapa',
    email: 'vikram.thapa@sample-league.com',
    description: 'Iron Corner Defender with formidable ankle holds',
    profilepic: 'kabaddi_01.png',
    auction: 'nukl kabbadi'
  },
  {
    _id: 'ply_009',
    id: 'ply_009',
    name: 'Rajesh Rana',
    email: 'rajesh.rana@sample-league.com',
    description: 'Agile Power Raider specializing in multi-point touches',
    profilepic: 'kabaddi_02.png',
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
    profilepic: 'sample_host.png'
  }
];

const inMemoryUsers = [
  {
    _id: 'usr_001',
    id: 'usr_001',
    username: 'Apex Titans',
    email: 'apex@nupl.com',
    password: '$2b$10$bGEm541I9rBYt2jZA9x3vu.IlXraNCFLr6JtzCLIaDxLbyAcddWnO', // Franchise123!
    profilepic: 'sample_franchise_apex.png',
    auctions: [
      { auction: 'nupl', budget: 1500000 },
      { auction: 'impetus', budget: 1000000 },
      { auction: 'futsal', budget: 850000 },
      { auction: 'nukl', budget: 900000 }
    ],
    players: [inMemoryPlayers[0]], // Alex Sterling
    save: async function () { return this; }
  },
  {
    _id: 'usr_002',
    id: 'usr_002',
    username: 'Royal Strikers',
    email: 'strikers@nupl.com',
    password: '$2b$10$bGEm541I9rBYt2jZA9x3vu.IlXraNCFLr6JtzCLIaDxLbyAcddWnO', // Franchise123!
    profilepic: 'sample_franchise_strikers.png',
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
