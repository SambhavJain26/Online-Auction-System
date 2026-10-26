const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userModel = require('../models/users-model');
const hostModel = require('../models/host-model');
const playerModel = require('../models/players-model');
const auctionModel = require('../models/auction-model');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onlineAuctionSystem';

async function seed() {
  console.log('Connecting to MongoDB for seeding...');
  await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to database:', mongoURI);

  // Clear existing collections
  await hostModel.deleteMany({});
  await userModel.deleteMany({});
  await playerModel.deleteMany({});
  await auctionModel.deleteMany({});
  console.log('Cleared existing collections.');

  // Create default Host
  const hostSalt = await bcrypt.genSalt(10);
  const hostHashedPassword = await bcrypt.hash('HostPass123!', hostSalt);
  const defaultHost = await hostModel.create({
    hostname: 'League Commissioner',
    email: 'host@auction.com',
    password: hostHashedPassword,
    profilepic: '0b9008feb2b40826fd553b66.png'
  });
  console.log('Created Host:', defaultHost.email);

  // Create default Franchises
  const userSalt = await bcrypt.genSalt(10);
  const userHashedPassword = await bcrypt.hash('Franchise123!', userSalt);

  const franchise1 = await userModel.create({
    username: 'Apex Titans',
    email: 'apex@nupl.com',
    password: userHashedPassword,
    profilepic: '14840e22c80a1a8cc1be9e77.png',
    auctions: [
      { auction: 'nupl', budget: 1500000 },
      { auction: 'impetus', budget: 1000000 },
      { auction: 'futsal', budget: 850000 },
      { auction: 'nukl', budget: 900000 }
    ],
    players: []
  });

  const franchise2 = await userModel.create({
    username: 'Royal Strikers',
    email: 'strikers@nupl.com',
    password: userHashedPassword,
    profilepic: '4abedcd1fb78e57fb7223e54.png',
    auctions: [
      { auction: 'nupl', budget: 1800000 },
      { auction: 'impetus', budget: 1200000 },
      { auction: 'futsal', budget: 950000 },
      { auction: 'nukl', budget: 1100000 }
    ],
    players: []
  });
  console.log('Created Franchises: Apex Titans and Royal Strikers');

  // Seed Players across all 4 categories
  const playersData = [
    // NUPL Cricket
    {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@nupl.com',
      description: 'Right-handed Top Order Batsman & Athletic Fielder',
      profilepic: '1a219fbc0ec7d5cb64507c27.jpg',
      auction: 'nupl cricket'
    },
    {
      name: 'Rohan Verma',
      email: 'rohan.verma@nupl.com',
      description: 'Right-arm Fast Bowler (Express Pace 140+ km/h)',
      profilepic: '1b0ca73591429759aa531cbc.jpg',
      auction: 'nupl cricket'
    },
    {
      name: 'Karan Patel',
      email: 'karan.patel@nupl.com',
      description: 'Spin All-Rounder & Middle-Order Finisher',
      profilepic: '37934a32241a0e3b0460fe66.jpg',
      auction: 'nupl cricket'
    },
    // Impetus
    {
      name: 'Vikramaditya Roy',
      email: 'vikram.roy@impetus.com',
      description: 'Grandmaster Strategist & Lead Gaming Tactician',
      profilepic: '536c44f94de316d1715ddcc6.jpg',
      auction: 'impetus'
    },
    {
      name: 'Aditya Mehta',
      email: 'aditya.mehta@impetus.com',
      description: 'High-speed Analytical Problem Solver & Esports Lead',
      profilepic: '613ff6ab95079692e9cab912.jpg',
      auction: 'impetus'
    },
    // Futsal
    {
      name: 'Mateo Silva',
      email: 'mateo.silva@futsal.com',
      description: 'Dynamic Pivot Forward & Precision Finisher',
      profilepic: '63ea9e19c6a51dc35206ccf2.jpg',
      auction: 'futsal'
    },
    {
      name: 'Devendra Joshi',
      email: 'devendra.joshi@futsal.com',
      description: 'Elite Goalkeeper with rapid reflexes and shot stopping',
      profilepic: '64a59f6999b9bcc6333406fb.jpg',
      auction: 'futsal'
    },
    // NUKL Kabaddi
    {
      name: 'Suraj Yadav',
      email: 'suraj.yadav@nukl.com',
      description: 'Iron Corner Defender with formidable ankle holds',
      profilepic: '691852416db97c593fb80b44.jpg',
      auction: 'nukl kabbadi'
    },
    {
      name: 'Manpreet Singh',
      email: 'manpreet.singh@nukl.com',
      description: 'Agile Power Raider specializing in multi-point toe-touches',
      profilepic: '738827757bbed88e1be8e9ec.jpg',
      auction: 'nukl kabbadi'
    }
  ];

  const createdPlayers = await playerModel.insertMany(playersData);
  console.log(`Seeded ${createdPlayers.length} players across 4 sports leagues.`);

  // Assign one player to franchise1 to populate "Your Picks"
  franchise1.players.push(createdPlayers[0]._id);
  await franchise1.save();
  console.log(`Assigned initial pick ${createdPlayers[0].name} to ${franchise1.username}.`);

  // Seed auction timing records
  const leagues = ['nupl', 'impetus', 'futsal', 'nukl'];
  for (let l of leagues) {
    await auctionModel.create({
      auctionName: l,
      startTime: new Date(),
      users: [franchise1._id, franchise2._id]
    });
  }
  console.log('Auction timings initialized.');

  console.log('=== Database Seeding Completed Successfully ===');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
