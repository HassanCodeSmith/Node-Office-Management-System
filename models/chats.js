const mongoose = require("mongoose");

const chatConversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      createdAt: {
        type: String,
        // default: Date.now,
      },
    },
  ],
  permanentDeleted: {
    type: Boolean,
    default: false,
  },
});

const ChatConversation = mongoose.model("Chat", chatConversationSchema);

module.exports = ChatConversation;
