import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import PostRoutes from "./routes/PostRoutes.js";
import MessageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// CONNECT DB
connectDB();

const app = express();
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
const url = "/api/v1";
// console.log(url);
// console.log(typeof(url));

app.use(url, authRoutes); // clear
app.use(url, MessageRoutes);
// app.use(url, PostRoutes);


//PORT
const port = process.env.PORT;

//SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//ROUTE
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });