import express from "express";
import "dotenv/config";
import cors from "cors";

//API route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//Middleware imports
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8800;

//Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Welcome to AMORE");
});

app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);

app.listen(PORT, () => console.log(`Server has started on ${PORT}`));