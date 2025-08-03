import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";

function Home() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const username = useSelector((state) => state.auth.userData?.username);
  const [loading, setLoading] = useState(false);
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAndStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/current-user`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (response.ok) {
          const userData = data.message.user;
          const todos = data.message.todo || [];
          dispatch(login(userData));
          const completed = todos.filter((todo) => todo.completed).length;
          setTodoStats({
            total: todos.length,
            completed,
          });
        } else {
          // Session expired or not logged in
          dispatch(logout());
        }
      } catch (error) {
        setError("Something went wrong while loading user profile.");
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, [dispatch]);

  const pendingTodos = todoStats.total - todoStats.completed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-lg p-8 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
          Welcome, {authStatus ? username || "User" : "Guest"} 👋
        </h1>

        <p className="text-gray-600 mb-6">
          Manage your tasks efficiently and stay productive!
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm font-medium text-white">
          <div className="bg-blue-500 rounded-lg py-3 shadow-md">
            <p>Total Todos</p>
            <p className="text-xl font-bold">{todoStats.total}</p>
          </div>
          <div className="bg-green-500 rounded-lg py-3 shadow-md">
            <p>Completed</p>
            <p className="text-xl font-bold">{todoStats.completed}</p>
          </div>
          <div className="bg-yellow-500 rounded-lg py-3 shadow-md">
            <p>Pending</p>
            <p className="text-xl font-bold">{pendingTodos}</p>
          </div>
        </div>

        {authStatus ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/add-todo"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition"
            >
              ➕ Add Todo
            </Link>
            <Link
              to="/all-todo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
            >
              📋 View Todos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
            >
              🔐 Login
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
            >
              📝 Signup
            </Link>
          </div>
        )}

        {error && (
          <p className="text-red-600 mt-4 text-sm font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Home;
