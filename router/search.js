const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

router.get("/:searchValue", searchController.searchConversations);
router.get("/searchname/:name", searchController.searchByContactName);
router.get("/searchphone/:phoneNumber", searchController.searchByPhoneNumber);

module.exports = router;
