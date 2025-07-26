import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    todoTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
