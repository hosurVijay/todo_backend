import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

function Logout() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logoutUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/logout", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.data || "Failed to logout");
          setLoading(false);
          return;
        }

        dispatch(logout());
        navigate("/login", { replace: true }); // ensure redirect replaces history
      } catch (error) {
        setError("Something went wrong.");
        setLoading(false);
      }
    };

    logoutUser();
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[40vh] text-red-600">
      {loading ? "Logging out..." : error ? error : "Logged out."}
    </div>
  );
}

export default Logout;
