const { Server } = require("socket.io");
const Chat = require("./models/chats");
const User = require("./models/user");

const { getConversation } = require("./controllers/chat");
const {
  getNotificationSocket,
} = require("./controllers/notification.controllers");
const {
  getAnnouncementSocket,
} = require("./controllers/Announcement.controllers");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    const user = users.find(
      (userkey) => userkey.userId.toString() === userId.toString()
    );
    return user;
  };

  io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.on("addUser", async (userId, receiver) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      let conversationData = [];
      try {
        const conversation = await getConversation(userId, receiver);
        conversationData = conversation.data;

        socket.emit("userMsgs", conversationData);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    });

    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, text, createdAt }) => {
        console.log(":::::::>>>>", senderId);
        console.log(":::::::>>>>", receiverId);
        console.log(":::::::>>>>", text);
        console.log(":::::::>>>>", createdAt);

        let conversation = await Chat.findOne({
          $or: [
            { participants: [senderId, receiverId] },
            { participants: [receiverId, senderId] },
          ],
        });

        if (conversation) {
          conversation.messages.push({
            sender: senderId,
            message: text,
            createdAt,
          });

          const receiverData = await User.findById(receiverId);
          const senderData = await User.findById(senderId);
        } else {
          conversation = new Chat({
            participants: [senderId, receiverId],
            messages: [
              {
                sender: senderId,
                message: text,
                createdAt,
              },
            ],
          });
        }

        await conversation.save();
        const receiver = getUser(receiverId);

        io.emit("getMessage", {
          sender: senderId,
          message: text,
          createdAt,
        });
      }
    );
    socket.on("getNotifications", async (userId) => {
      const notificationResponse = await getNotificationSocket(userId);
      io.to(socket.id).emit("notification", notificationResponse.data);
    });
    socket.on("getAnnouncement", async () => {
      const announcementResponse = await getAnnouncementSocket();
      io.emit("announcement", announcementResponse.data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = setupSocket;
