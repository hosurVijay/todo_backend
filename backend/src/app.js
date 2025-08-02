import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Todo routes
import todoRoutes from "./Routes/todo.routes.js";
app.use("/api/v1/todo", todoRoutes);

// User routes
import userRoutes from "./Routes/user.todo.js";
app.use("/api/v1/user", userRoutes);

export { app };
