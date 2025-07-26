import Message from "../models/message.js";
import User from "../models/User.js";

import cloudinary from "../lib/cloudinary.js";
import {io, userSocketMap} from "../server.js"




// Get all users (except the current user) for the left sidebar,
// and count the number of unread messages from each user.
export const getUsersForLeftSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all users except the current user, exclude password field
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unreadMessages = {};

    // For each user, count unread messages sent to the current user
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        sender: user._id,
        receiver: userId,
        isRead: false
      });

      if (messages.length > 0) {
        unreadMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unreadMessages
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages between the current user and the selected user.
// Also mark received messages as read.
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Find all messages exchanged between the two users
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: myId }
      ]
    });

    // Mark received messages as read
    await Message.updateMany(
      { sender: selectedUserId, receiver: myId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all messages from a specific sender to the current user as read.
export const markMessagesAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      { sender: senderId, receiver: receiverId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, attachments = [] } = req.body;
    const receiver = req.params.id;
    const sender = req.user._id;

  

    // Handle file uploads
    const uploadedAttachments = [];

    for (const attachment of attachments) {
      if (!attachment || !attachment.data || !attachment.type) continue;

      const uploaded = await cloudinary.uploader.upload(attachment.data, {
        resource_type: attachment.type === "video" ? "video" : "auto",
      });

      uploadedAttachments.push({
        url: uploaded.secure_url,
        type: attachment.type,
      });
    }

    // Create the message
    const newMessage = await Message.create({
      sender,
      receiver,
      content: text || "",
      attachments: uploadedAttachments,
    });

    const receiverSocketId = userSocketMap[receiver];

    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json({ success: true, newMessage });

  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};