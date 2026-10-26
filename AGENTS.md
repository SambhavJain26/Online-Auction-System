# AGENTS.md: Technical Architecture & Development Guidelines

## Project: Online Auction System
Lead Architect & Systems Engineer: Sambhav Jain
Repository: https://github.com/SambhavJain26/Online-Auction-System

---

## 1. Architectural Mission & Constraints

The Online Auction System is a real-time multiplayer bidding platform designed for collegiate and professional sports leagues (NUPL Cricket, Impetus, Futsal, NUKL Kabaddi). It provides authoritative real-time event distribution between League Hosts (Auctioneers) and Registered Franchises (Bidders).

### Core Stack
- **Runtime & Gateway**: Node.js 18+, Express 4.x
- **Real-Time WebSockets**: Socket.IO 4.x with segregated league namespaces
- **Templating & UI**: EJS (Embedded JavaScript) with Tailwind CSS and PostCSS
- **Persistence Layer**: MongoDB 6+ via Mongoose ODM
- **Authentication**: Stateless JSON Web Tokens (JWT) in HTTP-only cookies, salted Bcrypt hashing (10 rounds)

---

## 2. Real-Time Socket.IO Protocol Specification

The auction operates via isolated Socket.IO namespaces per league:
- Host Namespace: `/host/:league` (e.g., `/host/nupl`)
- Franchise Namespace: `/users/:league` (e.g., `/users/nupl`)

### Event Sequence Matrix
1. **Player Presentation**:
   - Host emits `shareSelectedPlayer(player)` on `/host/:league`.
   - Server resets bid state (`currentBid = 0`, `bidHistory = []`, `countdownTimer = 10`, `biddingEnabled = true`).
   - Server broadcasts to both namespaces:
     - `receiveSelectedPlayer(player)`
     - `currentBidUpdate(0)`
     - `bidHistoryUpdate([])`
     - `timerUpdate(10)`
     - `biddingStatusUpdate(true)`
     - `passButtonStatus(true)`

2. **Bid Placement**:
   - Franchise emits `placeBid({ userId, newBid })` on `/users/:league`.
   - Server verifies `biddingEnabled === true` and `newBid > currentBid`.
   - Server appends to `bidHistory`, clears `passedUsers`, and broadcasts `currentBidUpdate` and `bidHistoryUpdate`.
   - Server triggers `resetAndStartTimer()`: resets countdown to 10 seconds and ticks every 1000ms.

3. **Pass Action & Unsold Handling**:
   - Franchise emits `pass(userId)`.
   - Server records `passedUsers.add(userId)` and broadcasts "Passed" in `bidHistory`.
   - If `passedUsers.size >= activeSockets.size`, countdown is terminated and server emits `unsoldPlayer`.

4. **Countdown Expiry & Winner Declaration**:
   - When `countdownTimer === 0`, server terminates timer, disables bidding (`biddingEnabled = false`), and invokes `announceWinner()`.
   - Server identifies the last valid monetary bidder from `bidHistory`.
   - Server updates franchise record in MongoDB (`winner.players.push(player._id)`).
   - Server broadcasts `announceWinner({ username, player })` displaying the winner modal overlay.

---

## 3. Strict Style & Formatting Rules (BANNED: Em Dashes)

- **Em Dashes (\u2014) and En Dashes (\u2013) are STRICTLY BANNED**: Never use em dashes or en dashes anywhere in documentation, code comments, commit messages, or EJS views.
- Use colons, parentheses, commas, or standard single ASCII hyphens (-) exclusively.

---

## 4. Security & Credential Hygiene

- All credentials, session secrets, and connection strings must be read strictly from environment variables (`.env`).
- Never commit `.env` or sensitive tokens to version control.
- Ensure all passwords stored in the database are hashed using `bcrypt` with at least 10 salt rounds.

---

## 5. Development & Deployment Procedures

### Environment Configuration
Copy `.env.example` to `.env` and configure:
```env
PORT=3008
MONGODB_URI=mongodb://127.0.0.1:27017/onlineAuctionSystem
JWT_KEY=your_jwt_secret_key
EXPRESS_SESSION_SECRET=your_session_secret
```

### Database Seeding
Execute the automated seed script to populate sample hosts, franchises, and athletes:
```bash
npm run seed
```

### Service Launch
Start the server:
```bash
npm start
```
Default application URL: `http://localhost:3008`
Health Check URL: `http://localhost:3008/health`
