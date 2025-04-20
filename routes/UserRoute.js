import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {getAllUser, getUserById, createUser, deleteUser, updateUser} from "../controllers/UserController.js"

const router = express.Router();

// GET DATA ALL USER 
router.get("/users-list", protect, adminOnly, getAllUser);



// GET USER BY ID
router.get("/users/:id", protect, adminOnly, getUserById);

// // DELETE USER
router.delete("/users-delete/:id", protect, adminOnly, deleteUser);

// //UPDATE USER
router.patch("/users-update/:id", protect, adminOnly, updateUser);

// //CREATE USER
router.post("/users", protect, adminOnly, createUser);


export default router;