import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //   const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ statuse_code: 401, status: "Unauthorized", message: "No token found, please login" });

  try {

    // Verifikasi token dan ambil data user dari payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Mencari user berdasarkan ID
    const user = await User.findById(decoded.id);
    console.log("user", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// middleware untuk admin karena fitur delete hanya bisa dilakukan oleh admin
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden: Admin Only" });
  next();
};
