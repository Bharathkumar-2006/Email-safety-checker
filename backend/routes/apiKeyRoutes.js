const express = require("express");
const { checkEmail } = require("../controllers/apiKeyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/check-email", authMiddleware, checkEmail);

module.exports = router;
