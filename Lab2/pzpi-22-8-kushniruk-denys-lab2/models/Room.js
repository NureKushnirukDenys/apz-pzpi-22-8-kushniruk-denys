const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    status: { type: Boolean, default: false },
    iotDeviceId: { type: String, required: true },
    distance: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
