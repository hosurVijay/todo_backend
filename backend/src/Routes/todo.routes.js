import { Router } from "express";
import {
  addTodo,
  updateTodo,
  getAllTodo,
  getTodoID,
  deleteTodo,
} from "../Controller/todo.controller.js";
import { verifyUser } from "../MiddleWare/auth.middleware.js";
const router = Router();

router.route("/add-Todo").post(verifyUser, addTodo);
router.route("/get-all-todo").get(verifyUser, getAllTodo);
router.route("/update-todo/:id").put(verifyUser, updateTodo);
router.route("/get-todo/:id").get(verifyUser, getTodoID);
router.route("/delete-todo/:id").delete(verifyUser, deleteTodo);

export default router;
