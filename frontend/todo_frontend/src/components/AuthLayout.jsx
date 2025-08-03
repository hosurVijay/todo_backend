import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authStatus === null) return;

    const shouldRedirectToLogin = authentication && !authStatus;
    const shouldRedirectToHome = !authentication && authStatus;

    if (shouldRedirectToLogin) {
      navigate("/login", { replace: true });
    } else if (shouldRedirectToHome) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [authStatus, navigate, authentication]);

  return loading ? (
    <h1 className="text-center text-2xl font-semibold">Loading...</h1>
  ) : (
    <>{children}</>
  );
}
