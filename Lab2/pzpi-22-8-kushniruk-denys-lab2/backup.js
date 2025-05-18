const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const uri = process.env.CONNECT_URL_MONGODB;

async function backupCollection(modelName, fileName) {
  const Model = mongoose.model(
    modelName,
    new mongoose.Schema({}, { strict: false })
  );
  const data = await Model.find({});
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Колекція ${modelName} збережена у ${fileName}`);
}

async function main() {
  await mongoose.connect(uri);

  await backupCollection("Light", "./backup/light.json");
  await backupCollection("Room", "./backup/room.json");
  await backupCollection("User", "./backup/user.json");
  await backupCollection("Log", "./backup/log.json");

  await mongoose.disconnect();
}

main();
