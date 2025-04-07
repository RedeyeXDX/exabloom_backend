"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const csvFilePath = path.resolve(
      __dirname,
      "../seed-data/message_content.csv"
    );
    const messageTemplates = [];

    // Step 1: Load CSV content
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.message) {
            messageTemplates.push(row.message);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Step 2: Get all contact IDs
    const contacts = await queryInterface.sequelize.query(
      `SELECT id FROM "Contacts";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const contactIds = contacts.map((c) => c.id);
    const messages = [];
    const totalMessages = 5000000;

    console.log(`Seeding ${totalMessages} messages...`);

    // Step 3: Generate messages in batches
    for (let i = 0; i < totalMessages; i++) {
      const randomContactId =
        contactIds[Math.floor(Math.random() * contactIds.length)];
      const randomMessage =
        messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

      messages.push({
        contactId: randomContactId,
        content: randomMessage,
        timestamp: faker.date.past(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Insert in batches of 100,000
      if (messages.length === 100000 || i === totalMessages - 1) {
        await queryInterface.bulkInsert("Messages", messages);
        messages.length = 0;
        console.log(`Inserted ${i + 1} messages...`);
      }
    }

    console.log("✅ Finished seeding messages!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Messages", null, {});
  },
};
