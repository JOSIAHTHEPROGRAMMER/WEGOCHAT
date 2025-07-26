import mongoose from "mongoose";

// User schema for chat app
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    discriminator: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    status: { type: String, default: 'online' },
    isActive: { type: Boolean, default: true },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Ensure unique username/discriminator combination
userSchema.index({ username: 1, discriminator: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;
