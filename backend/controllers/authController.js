const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create an account on third-party email checker service
    const response = await axios.post("THIRD_PARTY_API/signup", {
      username,
      email: `${username}@yourdomain.com`,  // Modify if needed
      password
    });

    if (!response.data.apiKey) {
      return res.status(500).json({ message: "Failed to create third-party account" });
    }

    // Store user in MongoDB
    user = new User({
      username,
      password: hashedPassword,
      apiKey: response.data.apiKey
    });

    await user.save();

    res.status(201).json({ message: "Signup successful! Please activate your account." });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, message: "Login successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
