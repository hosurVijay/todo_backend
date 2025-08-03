import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/user/current-user",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (data?.message) {
          dispatch(login(data.message));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-100">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-blue-50">
      {!loading && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
