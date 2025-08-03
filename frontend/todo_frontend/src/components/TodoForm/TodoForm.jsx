import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";

function TodoForm() {
  const [todoTitle, setTodoTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddedTodo = async (e) => {
    e.preventDefault();
    setError("");

    if (!todoTitle.trim()) {
      setError("Todo title cannot be empty.");
      return null;
    }
    setLoading(true);
    try {
      const addTodo = await fetch(
        "http://localhost:3000/api/v1/todo/add-todo",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ todoTitle: todoTitle }),
        }
      );
      const todo = await addTodo.json();

      if (!addTodo.ok) {
        setError(todo.message || "Failed to add todo.");
      } else {
        setTodoTitle("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again after some time.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Add Todo</h2>
        <form onSubmit={handleAddedTodo} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter Todo..."
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Todo"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default TodoForm;
