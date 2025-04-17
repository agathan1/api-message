import express from "express";
import { postData } from "../controllers/PostController.js";

const router = express.Router();


// CRUD

// CREATE DATA
router.post("/post", postData)

// READ DATA

export default router;