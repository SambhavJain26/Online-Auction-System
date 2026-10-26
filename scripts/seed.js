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
    profilepic: 'sample_host.png'
  });
  console.log('Created Host:', defaultHost.email);

  // Create default Franchises
  const userSalt = await bcrypt.genSalt(10);
  const userHashedPassword = await bcrypt.hash('Franchise123!', userSalt);

  const franchise1 = await userModel.create({
    username: 'Apex Titans',
    email: 'apex@nupl.com',
    password: userHashedPassword,
    profilepic: 'sample_franchise_apex.png',
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
    profilepic: 'sample_franchise_strikers.png',
    auctions: [
      { auction: 'nupl', budget: 1800000 },
      { auction: 'impetus', budget: 1200000 },
      { auction: 'futsal', budget: 950000 },
      { auction: 'nukl', budget: 1100000 }
    ],
    players: []
  });
  console.log('Created Franchises: Apex Titans and Royal Strikers');

  // Seed Sanitized Sample Players across all 4 categories
  const playersData = [
    // NUPL Cricket
    {
      name: 'Alex Sterling',
      email: 'alex.sterling@sample-league.com',
      description: 'Right-handed Top Order Batsman & Captain',
      profilepic: 'cricket_01.png',
      auction: 'nupl cricket'
    },
    {
      name: 'Liam Vance',
      email: 'liam.vance@sample-league.com',
      description: 'Right-arm Express Fast Bowler (145+ km/h)',
      profilepic: 'cricket_02.png',
      auction: 'nupl cricket'
    },
    {
      name: 'Jordan Cole',
      email: 'jordan.cole@sample-league.com',
      description: 'Spin All-Rounder & Middle-Order Finisher',
      profilepic: 'cricket_03.png',
      auction: 'nupl cricket'
    },
    // Impetus
    {
      name: 'Marcus Chen',
      email: 'marcus.chen@sample-league.com',
      description: 'Grandmaster Strategist & Gaming Tactician',
      profilepic: 'esports_01.png',
      auction: 'impetus'
    },
    {
      name: 'Tyler Brooks',
      email: 'tyler.brooks@sample-league.com',
      description: 'Analytical Problem Solver & Esports Lead',
      profilepic: 'esports_02.png',
      auction: 'impetus'
    },
    // Futsal
    {
      name: 'Lucas Silva',
      email: 'lucas.silva@sample-league.com',
      description: 'Dynamic Pivot Forward & Precision Finisher',
      profilepic: 'futsal_01.png',
      auction: 'futsal'
    },
    {
      name: 'David Miller',
      email: 'david.miller@sample-league.com',
      description: 'Elite Goalkeeper with rapid reflexes & shot stopping',
      profilepic: 'futsal_02.png',
      auction: 'futsal'
    },
    // NUKL Kabaddi
    {
      name: 'Vikram Thapa',
      email: 'vikram.thapa@sample-league.com',
      description: 'Iron Corner Defender with formidable ankle holds',
      profilepic: 'kabaddi_01.png',
      auction: 'nukl kabbadi'
    },
    {
      name: 'Rajesh Rana',
      email: 'rajesh.rana@sample-league.com',
      description: 'Agile Power Raider specializing in multi-point touches',
      profilepic: 'kabaddi_02.png',
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
