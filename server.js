// -----------------------------
//  IMPORTS
// -----------------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

// -----------------------------
//  APP SETUP
// -----------------------------
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // allows JSON body
app.use(express.urlencoded({ extended: true })); // allows form data

// -----------------------------
//  MONGODB CONNECTION
// -----------------------------
mongoose
  .connect(
    "mongodb+srv://aishwaryakamble0421_db_user:bpBNmr3NjdIBVqgu@aishwarya.sivoj7x.mongodb.net/stepahead?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ MongoDB Atlas Error:", err));



// -----------------------------
//  USER MODEL
// -----------------------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// -----------------------------
//  API ROUTES
// -----------------------------

// Create User (Signup)
app.post("/api/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: "User created", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// -----------------------------
//  FRONTEND STATIC FILE SETUP
// -----------------------------
app.use(express.static(path.join(__dirname, "../frontend/src")));

// Home page route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/src/pages/index.html"));
});

// Example route for any other page:
// app.get("/signup", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/src/pages/signup.html"));
// });

// -----------------------------
//  START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
