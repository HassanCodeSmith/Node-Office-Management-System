const Chat = require("../models/chats");
exports.getConversation = async (senderId, receiverId) => {
  const chat = await Chat.findOne({
    $or: [
      { participants: { $all: [senderId, receiverId] } },
      { participants: { $all: [receiverId, senderId] } },
    ],
  });

  return { data: chat };
};
