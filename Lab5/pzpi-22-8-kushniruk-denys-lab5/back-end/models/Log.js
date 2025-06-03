const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    action: { type: String, required: true },
    timestamp: { type: Date, required: true },
    timeOn: { type: Number, default: 0 },
    timeOff: { type: Number, default: 0 },
    averageLightTime: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
