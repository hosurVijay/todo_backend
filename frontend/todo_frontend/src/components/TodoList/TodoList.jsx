import React, { useEffect, useState } from "react";
import Input from "../Input";
import Button from "../Button";

function TodoList() {
  const [todos, setTodos] = useState([
    { _id: "1", todoTitle: "Buy groceries" },
    { _id: "2", todoTitle: "Complete React project" },
    { _id: "3", todoTitle: "Walk the dog" },
  ]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [todoDelete, setTodoDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editTodoId, setEditTodoId] = useState("");
  const [editTodoText, setEditTodoText] = useState("");

  const getAllTodo = async () => {
    setLoading(true);
    try {
      const getUserTodo = await fetch(
        "http://localhost:3000/api/v1/todo/get-all-todo",
        {
          credentials: "include",
        }
      );
      const data = await getUserTodo.json();

      if (!getUserTodo.ok) {
        setError(data.data || "Error fetching todos");
      } else {
        setTodos(data.message || []);
      }

      //   setTodos(data.todos);
    } catch (error) {
      setError("Failed to Load todos");
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async (id) => {
    setLoading(true);
    try {
      if (!editTodoText.trim()) return;
      const response = await fetch(
        `http://localhost:3000/api/v1/todo/update-todo/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todoTitle: editTodoText }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.data || "Failed to edit todo");
      } else {
        setEditTodoId("");
        setEditTodoText("");
        getAllTodo();
      }
    } catch (error) {
      setError("Error updating Todo");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/todo/delete-todo/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.data || "Failed to delete todo");
      } else {
        getAllTodo();
        setConfirmDelete(false);
        setTodoDelete(null);
      }
    } catch (error) {
      setError("Error deleting the todo");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllTodo();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Todos</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-white p-4 shadow flex justify-between items-center rounded"
            >
              {editTodoId === todo._id ? (
                <Input
                  type="text"
                  className="border p-2 flex-1 mr-2"
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                />
              ) : (
                <span>{todo.todoTitle}</span>
              )}
              <div className="flex gap-2">
                {editTodoId === todo._id ? (
                  <Button
                    onClick={() => editTodo(todo._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditTodoId(todo._id);
                      setEditTodoText(todo.todoTitle);
                    }}
                    className="bg-yellow-500 text-white px-3 rounded"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setConfirmDelete(true);
                    setTodoDelete(todo);
                  }}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {confirmDelete && todoDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <p className="p-4">
              Do you want to delete <strong>{todoDelete.todoTitle}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setConfirmDelete(false);
                  setTodoDelete(null);
                }}
              >
                Cancle
              </Button>
              <Button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => deleteTodo(todoDelete._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
