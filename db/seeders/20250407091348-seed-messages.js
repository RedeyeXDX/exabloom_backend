"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const csvFilePath = path.resolve(
      __dirname,
      "../seed-data/message_content.csv"
    );
    const messageTemplates = [];

    // Load CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.message) {
            messageTemplates.push(row.message.trim());
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log("✅ CSV loaded. Sample:", messageTemplates.slice(0, 2));

    // Get contact IDs
    const contacts = await queryInterface.sequelize.query(
      `SELECT id FROM "Contacts";`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const contactIds = contacts.map((c) => c.id);
    const totalMessages = 5000000;
    const batchSize = 100000;

    console.log(
      `📦 Seeding ${totalMessages} messages in batches of ${batchSize}...`
    );

    // Batch insert loop
    for (let i = 0; i < totalMessages; i += batchSize) {
      const messages = [];

      for (let j = 0; j < batchSize && i + j < totalMessages; j++) {
        const contactId =
          contactIds[Math.floor(Math.random() * contactIds.length)];
        const content =
          messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

        messages.push({
          contactId,
          content,
          timestamp: faker.date.past(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await queryInterface.bulkInsert("Messages", messages);
      console.log(
        `✅ Inserted ${Math.min(
          i + batchSize,
          totalMessages
        )} / ${totalMessages}`
      );
    }

    console.log("🎉 All messages seeded successfully.");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Messages", null, {});
    console.log("🧹 Rolled back all seeded messages.");
  },
};
