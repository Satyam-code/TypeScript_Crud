import "reflect-metadata";
import { verifyToken } from "./config/auth";
import express, { Application } from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/ormconfig";
import userRoutes from "./routes/userRoutes";
import authRouter from "./routes/authRouter";
import publicRoutes from "./routes/publicRoutes";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const PORT = 3000;
console.log("Serving static files from:", path.join(__dirname, "public"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Use authentication routes for login and token management
app.use("/auth", authRouter); // This will handle login and JWT token generation

// Public routes (no authentication required)
app.use("/api", publicRoutes);

// Use the user routes (for CRUD operations, for example)
app.use("/api", verifyToken, userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
