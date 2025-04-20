import Message from "../models/MessageModel.js";

export const sendMessage = async (req, res) => {
  console.log("Current user:", req.user); // cek user
  try {
    // const { send_to, message, created_by} = req.body;
    // const created_by = req.user._id;

    const newMessage = await Message.create({
      send_to: req.body.send_to,
      message: req.body.message,
      created_by: req.user.id,
    });
    return res.status(201).json({
      status: "success",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const getAllMessage = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // default 10 jika tidak ada query
    const page = parseInt(req.query.page) || 1; // default halaman pertama

    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments(); // total semua data

    // const message = await Message.find().populate("created_by", "_id");

    const message = await Message.find()
      .populate("created_by", "_id")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // optional: urutkan dari yang terbaru

    if (message.length === 0) {
      return res
        .status(200)
        .json({ status: "success", message: "Message not found" });
    }
    return res.status(200).json({
      status_code: 200,
      status: "success",
      currentPage: page,
      hasNextPage: page < Math.ceil(totalMessages / limit),
      totalPages: Math.ceil(totalMessages / limit),
      totalData: totalMessages,
      data: message,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status_code: 500, status: "failed", message: error.message });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const messageById = await Message.findById(req.params.id);
    if (!messageById) {
      return res
        .status(200)
        .json({ status: "success", message: "Message not found" });
    }

    return res.status(200).json({
      status: "success",
      data: messageById,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status_code: 500, status: "failed", message: error.message });
  }
};

export const getMyMessages = async (req, res) => {
  // req.params.id = req.user._id;
  try {
    const messages = await Message.find({ created_by: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: "success", data: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    // const { message } = req.body;
    const user = req.user;

    console.log("id", id);
    console.log("content", req.body);
    // Cek login
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // Ambil pesan dulu
    const messages = await Message.findById(id);
    if (!messages) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Cek akses: hanya owner atau admin
    const isOwner = messages.user_id && messages.user_id === user._id;
    // const isOwner = message.user._id === user._id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden. You can't update this message." });
    }

    if (messages.user_id !== req.user._id) {
      return res.status(403).json({ message: "Forbidden. Not your message." });
    }

    // Update dengan findByIdAndUpdate
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Message updated successfully", data: updatedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const updateMessage = async (req, res) => {
//   try {
//     const message = await Message.findById(req.params.id);
//     if (!message) return res.status(404).json({ message: "Message not found" });

//     message.message = req.body.message;
//     const updatedMessage = await message.save();
//     res.status(200).json({ message: "Message updated successfully", data: updatedMessage });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
