const db = require("../db/models/index");
const { Sequelize } = require("sequelize");

const getRecentConversations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const latestMessages = await db.Message.findAll({
      include: [{ model: db.Contact }],
      where: {
        timestamp: {
          [Sequelize.Op.in]: Sequelize.literal(`(
            SELECT MAX("timestamp")
            FROM "Messages"
            GROUP BY "contactId"
          )`),
        },
      },
      order: [["timestamp", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json(latestMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load conversations" });
  }
};

module.exports = { getRecentConversations };
