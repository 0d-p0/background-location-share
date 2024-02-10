const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    checkins: [
      {
        name: {
          type: String,
        },
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ], // <= corrected checkins schema
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
