const express = require("express");
const { getApiKey } = require("../controllers/apiKeyController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/apikey", authMiddleware, getApiKey);

module.exports = router;
