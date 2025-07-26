import mongoose from "mongoose";

// Message schema for chat app
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
 
  isRead: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      url: String,
      type: String, // e.g., 'image', 'video', 'file'
    },
  ],
  reactions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      type: {
        type: String,
        enum: ["like", "love", "laugh", "sad", "angry"],
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
  versionKey: false,
});


// Ensure unique message per conversation
messageSchema.index({ conversationId: 1, sender: 1, timestamp: 1 }, { unique: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
