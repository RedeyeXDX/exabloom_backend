const express = require("express");
const router = express.Router();
const conversationController = require("../controller/conversationController");

router.get("/", conversationController.getRecentConversations);

module.exports = router;
