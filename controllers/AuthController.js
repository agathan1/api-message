import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
	console.log("hashedPassword.length", hashedPassword.length);
	
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // const token = createToken(newUser._id);
    res.status(201).json({
		//   token,
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Username or email already exists",
      });
    }
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
	console.log("user is find?", user);
	
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Check apakah user ditemukan dan password cocok
    if (!user || !isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "User not found or invalid credentials",
      });
    }

    const token = createToken(user);
    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
