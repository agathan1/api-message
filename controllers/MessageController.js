import Message from "../models/MessageModel.js";

export const sendMessage = async (req, res) => {
  console.log("Current user:", req.user); // cek user
  try {
    // const { send_to, message, created_by} = req.body;
    // const created_by = req.user._id;

    const newMessage = await Message.create({ send_to: req.body.send_to, message: req.body.message, created_by: req.user.id });
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
    const message = await Message.find().populate("created_by", "username");
    if (message.length === 0) {
      return res
        .status(200)
        .json({ status: "success", message: "Message not found" });
    }
    return res.status(200).json({
      status_code: 200,
      status: "success",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ status_code: 500, status: "failed", message: error.message });
  }
};

export const getMessageById = async (req, res) => {
    try {
        const messageById = await Message.findById(req.params.id);
        console.log(req.params.id);
        if (!messageById) {
            return res.status(200).json({ status: "success", message: "Message not found" });
        }
        
        return res.status(200).json({
            status: "success",
            data: messageById
        })
    } catch (error) {
        res.status(500).json({ status_code: 500, status: "failed", message: error.message });
    }
}

export const getMyMessages = async (req, res) => {
  // req.params.id = req.user._id;
  try {
    const messages = await Message.find({ created_by: req.user._id }).sort({ createdAt: -1 });
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
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Not found" });

    if (message.user_id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden. Not your message." });
    }

    message.content = req.body.content || message.content;
    await message.save();

    res.json({ message: "Updated", data: message });
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
