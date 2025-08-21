import { generateToken } from "../lib/utils.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// signup
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate JWT token
    const token = generateToken(newUser._id, res);

    res.status(201).json({
      success: true,
      token, // 👈 send token back in response
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = generateToken(user._id, res);

    res.status(200).json({
      success: true,
      token, // 👈 send token back in response
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logout
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update avatar
export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (!avatar) return res.status(400).json({ message: "Avatar is required" });

    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      folder: "stayFinder/users/avatars",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Avatar updated",
      updatedUser,
    });
  } catch (error) {
    console.log("Error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check auth
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
