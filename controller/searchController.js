const db = require("../db/models/index");
const { Op, Sequelize } = require("sequelize");

const searchConversations = async (req, res) => {
  try {
    const searchValue = req.params.searchValue || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    // Step 1: Find contacts matching name or phone number
    const matchingContacts = await db.Contact.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchValue}%` } },
          { phoneNumber: { [Op.iLike]: `%${searchValue}%` } },
        ],
      },
      attributes: ["id"],
      raw: true,
    });

    const contactIdsFromContacts = matchingContacts.map((c) => c.id);

    // Step 2: Find messages that match content
    const matchingMessages = await db.Message.findAll({
      where: {
        content: { [Op.iLike]: `%${searchValue}%` },
      },
      attributes: ["contactId"],
      group: ["contactId"],
      raw: true,
    });

    const contactIdsFromMessages = matchingMessages.map((m) => m.contactId);

    // Combine unique contact IDs from both searches
    const uniqueContactIds = Array.from(
      new Set([...contactIdsFromContacts, ...contactIdsFromMessages])
    );

    // Step 3: Paginate & fetch latest message per contact
    const paginatedContactIds = uniqueContactIds.slice(offset, offset + limit);

    const results = await Promise.all(
      paginatedContactIds.map(async (contactId) => {
        const latestMessage = await db.Message.findOne({
          where: { contactId },
          order: [["timestamp", "DESC"]],
          include: [{ model: db.Contact }],
        });
        return latestMessage;
      })
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};

const searchByContactName = async (req, res) => {
  try {
    const searchName = req.params.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    // Step 1: Find matching contacts by name
    const matchingContacts = await db.Contact.findAll({
      where: {
        name: {
          [Op.iLike]: `%${searchName}%`,
        },
      },
      attributes: ["id"],
      raw: true,
    });

    const contactIds = matchingContacts.map((c) => c.id);

    // Step 2: Get latest message per contact
    const messages = await Promise.all(
      contactIds.slice(offset, offset + limit).map(async (contactId) => {
        const latestMessage = await db.Message.findOne({
          where: { contactId },
          order: [["timestamp", "DESC"]],
          include: [{ model: db.Contact }],
        });
        return latestMessage;
      })
    );

    res.status(200).json(messages.filter(Boolean));
  } catch (err) {
    console.error("Failed to search by name:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const searchByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    // Step 1: Find matching contacts by phone number
    const matchingContacts = await db.Contact.findAll({
      where: {
        phoneNumber: {
          [Op.iLike]: `%${phoneNumber}%`,
        },
      },
      attributes: ["id"],
      raw: true,
    });

    const contactIds = matchingContacts.map((c) => c.id);

    // Step 2: Get latest message per contact
    const messages = await Promise.all(
      contactIds.slice(offset, offset + limit).map(async (contactId) => {
        const latestMessage = await db.Message.findOne({
          where: { contactId },
          order: [["timestamp", "DESC"]],
          include: [{ model: db.Contact }],
        });
        return latestMessage;
      })
    );

    res.status(200).json(messages.filter(Boolean));
  } catch (err) {
    console.error("Failed to search by phone number:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  searchConversations,
  searchByContactName,
  searchByPhoneNumber,
};
