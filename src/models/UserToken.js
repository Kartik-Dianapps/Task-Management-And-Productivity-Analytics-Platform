const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }   // optional but useful
});

module.exports = mongoose.model("UserToken", userTokenSchema);
