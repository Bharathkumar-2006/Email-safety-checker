const axios = require("axios");

exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const apiKey = process.env.IPQS_API_KEY;
        const response = await axios.get(`https://www.ipqualityscore.com/api/json/email/${apiKey}/${email}`);

        res.json(response.data);
    } catch (err) {
        console.error("API Request Failed:", err);
        res.status(500).json({ message: "Error checking email" });
    }
};
