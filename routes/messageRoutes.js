import express from "express";
import {
  getAllMessage,
  sendMessage,
  getMessageById,
  getMyMessages,
  deleteMessage,
  updateMessage,
} from "../controllers/MessageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import multer from "multer";
// const upload = multer();

const upload = multer({
  limits: {
    fieldNameSize: 100, // Batas panjang nama field (karakter)
    fieldSize: 1024 * 1024, // Batas ukuran isi pesan/field (1 MB)
    fields: 10 // Batas maksimal jumlah field teks
  }
});

const router = express.Router();

// CREAT MESSAGE
router.post("/message", upload.none(), protect, sendMessage); // untuk mencoba POST DI POSTMAN dengan form-data

// READ MESSAGE
router.get("/message-list", getAllMessage);

// READ MESSAGE
router.get("/message-list/:id", getMessageById);

// READ MY MESSAGE
router.get("/my-message", protect, getMyMessages);

// DELETE MESSAGE
router.delete("/message/:id", protect, adminOnly, deleteMessage);

// UPDATE MESSAGE
router.patch("/message-update/:id", protect, adminOnly, updateMessage);

export default router;
