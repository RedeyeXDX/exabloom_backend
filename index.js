const express = require("express");
const app = express();
const port = 8080;
const conversationRoutes = require("./router/conversations");
const searchRoutes = require("./router/search");

app.use(express.json());
app.use("/conversations", conversationRoutes);
app.use("/search", searchRoutes);

console.log("Successfully connected to DB!");
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
