const User = require("../models/User");

exports.getApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
