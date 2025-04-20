import userModel from "../models/UserModel.js";
import { registerUser } from "../controllers/AuthController.js";

export const getAllUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // default 10 jika tidak ada query
    const page = parseInt(req.query.page) || 1; // default halaman pertama
    const skip = (page - 1) * limit;

    const totalUsers = await userModel.countDocuments(); // total semua data

    const users = await userModel
      .find()
      .populate("_id")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // optional: urutkan dari yang terbaru

    if (users.length === 0) {
      return res
        .status(200)
        .json({ status: "success", message: "Message not found" });
    }

    // const users = await userModel.find();
    res.status(200).json({
      status: "success",
      currentPage: page,
      hasNextPage: page < Math.ceil(totalUsers / limit),
      totalPages: Math.ceil(totalUsers / limit),
      totalData: totalUsers,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const users = await userModel.findById(req.params.id);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createUser = async (req, res) => {
  return await registerUser(req, res);
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success deleted", data: user });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const targetUser = await userModel.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    ); // ✅ findById langsung pakai id
    console.log("targetUser", targetUser);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: targetUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // ✅ gunakan `error`, bukan `err`
  }
};
