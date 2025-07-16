import { asyncHandler } from "../Utills/asyncHandler.js";
import { User } from "../Models/user.model.js";
import { Todo } from "../Models/todo.models.js";
import { ApiError } from "../Utills/apiError.js";
import { ApiResponse } from "../Utills/apiResponse.js";

const addTodo = asyncHandler(async (req, res) => {
  const { todoTitle } = req.body;
  if (!todoTitle) {
    throw new ApiError(400, "Todo tittle required.");
  }

  const todo = await Todo.create({
    todoTitle,
    owner: req.user?._id,
    completed: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "New Todo Added successfully", todo));
});

const getAllTodo = asyncHandler(async (req, res) => {
  const userid = req.user?._id;
  if (!userid) {
    throw new ApiError(400, "No user found.");
  }

  const todo = await Todo.find({ owner: userid });

  const todos = todo.length;

  const message =
    todos === 0 ? "no todos found!" : "Fetched the todos successfully.";

  return res.status(200).json(new ApiResponse(200, message, todo));
});

const getTodoID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "no Todo found.");
  }

  const getTodo = await Todo.findOne({ _id: id, owner: req.user?._id });

  if (!getTodo) {
    throw new ApiError(400, "No todo found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo found successfully.", getTodo));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { todoTitle, completed } = req.body;
  const { id } = req.params;
  if (!todoTitle && typeof completed !== "boolean") {
    throw new ApiError(400, "Nothing to upadate.");
  }

  const updatedField = {};

  if (todoTitle) updatedField.todoTitle = todoTitle;
  if (typeof completed === "boolean") updatedField.completed = completed;

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: id, owner: req.user?._id },
    { $set: updatedField },
    { new: true }
  );

  if (!updatedTodo) {
    throw new ApiError(400, "Not authorized. No updates found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo updated successfully", updateTodo));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, owner: req.user?._id });
  if (!todo) {
    throw new ApiError(400, "No Todo found!");
  }

  const todoDelete = await todo.deleteOne();

  if (!todoDelete) {
    throw new ApiError(400, "something went wrong, Todo couldn't be delted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo Delted successfully", null));
});
export { addTodo, getAllTodo, getTodoID, updateTodo, deleteTodo };
