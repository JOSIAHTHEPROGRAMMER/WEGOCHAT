import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateAuthToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

/**
 * Signup controller - Registers a new user.
 * Expects: username, password, email, bio in req.body
 */
export const signup = async (req, res) => {
  const { username, password, email, bio } = req.body;

  // Validate required fields
  if (!username || !password || !email || !bio) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if user with the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Account with this email already exists.' });
    }

    // Generate a unique 4-digit discriminator for the username
    let discriminator;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    do {
      discriminator = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
      const tagExists = await User.findOne({ username, discriminator });
      if (!tagExists) break;
      attempts++;
    } while (attempts < MAX_ATTEMPTS);

    // Fail if unable to generate a unique discriminator
    if (attempts === MAX_ATTEMPTS) {
      return res.status(500).json({ error: 'Unable to generate a unique user tag.' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Create new user document
    const newUser = new User({
      username,
      discriminator,
      email,
      password: hashedPassword,
      bio,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token for authentication
    const token = generateAuthToken(newUser);

    // Respond with success and user data
    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: newUser,
      token
    });

  } catch (error) {
    // Handle errors during signup
    console.error('Error during signup:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user: ' + error.message
    });
  }
};

/**
 * Login controller - Authenticates a user.
 * Expects: username ("Ted bundy") or email and password in req.body
 */
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username or email and password are required.' });
  }

  try {
    // Check if identifier is an email
    const isEmail = identifier.includes('@');
    const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateAuthToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user,
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login: ' + error.message
    });
  }
};


// Controller to check if user is authenticated
export const isAuthenticated = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'User is authenticated.',
      user: req.user
    });
  } else {
    return res.status(401).json({ error: 'User is not authenticated.' });
  }
}

// Controller to update user information
// Expects: username, bio, profile picture in req.body
export const updateUser = async (req, res) => {
  const { profilePicture, username, bio } = req.body;
  const userId = req.user._id;

  // Require at least one field to update
  if (!username && !bio && !profilePicture) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (username, bio, or profile picture) must be provided to update.',
    });
  }

  try {
    const updateData = {};

   


    // Check for username uniqueness
    if (username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: userId } });
      if (usernameExists) {
        return res.status(409).json({ success: false, message: 'Username already taken.' });
      }
      updateData.username = username;
    }

    if (bio) updateData.bio = bio;

    // Upload new profile picture if provided
if (profilePicture) {
  try {
    const uploadResult = await cloudinary.uploader.upload(profilePicture, {
      folder: 'chatapp_profiles',
    });
    updateData.profilePicture = uploadResult.secure_url;
  } catch (err) {
    console.error(' Cloudinary upload failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Cloudinary upload failed: ' + err.message,
    });
  }
}



    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password -__v' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user: ' + error.message, 
    });
  }
};


export const setStatus = async (req, res) => {
  const { status } = req.body;
  const userId = req.user?._id; 

  if (!['online', 'offline', 'afk', 'invisible'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, message: 'Status updated.', user: updatedUser });
  } catch (error) {
    console.error('Error setting status:', error);
    res.status(500).json({ success: false, message: 'Error updating status.' });
  }
};
