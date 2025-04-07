const db = require("../db/models/index");
const { Op, Sequelize } = require("sequelize");

const searchConversations = async (req, res) => {
  try {
    const searchValue = req.params.searchValue || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const [results] = await db.sequelize.query(
      `
      SELECT DISTINCT ON (m."contactId") m.*, c.*
      FROM "Messages" m
      INNER JOIN "Contacts" c ON m."contactId" = c.id
      WHERE c.name ILIKE :search
         OR c."phoneNumber" ILIKE :search
         OR m.content ILIKE :search
      ORDER BY m."contactId", m."timestamp" DESC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: {
          search: `%${searchValue}%`,
          limit,
          offset,
        },
      }
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Search failed:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

const searchByContactName = async (req, res) => {
  try {
    const name = req.params.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const [results] = await db.sequelize.query(
      `
      SELECT DISTINCT ON (m."contactId") m.*, c.*
      FROM "Messages" m
      INNER JOIN "Contacts" c ON m."contactId" = c.id
      WHERE c.name ILIKE :search
      ORDER BY m."contactId", m."timestamp" DESC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: {
          search: `%${name}%`,
          limit,
          offset,
        },
      }
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Name search failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};
const searchByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const [results] = await db.sequelize.query(
      `
      SELECT DISTINCT ON (m."contactId") m.*, c.*
      FROM "Messages" m
      INNER JOIN "Contacts" c ON m."contactId" = c.id
      WHERE c."phoneNumber" ILIKE :search
      ORDER BY m."contactId", m."timestamp" DESC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: {
          search: `%${phoneNumber}%`,
          limit,
          offset,
        },
      }
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Phone search failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  searchConversations,
  searchByContactName,
  searchByPhoneNumber,
};
