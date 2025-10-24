import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("spendsense_token") ||
      sessionStorage.getItem("spendsense_token");

    if (token) {
      setHasToken(true);
    }
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return <div className="text-gray-400 text-center mt-10">Loading...</div>;
  }

  if (!hasToken) {
    return <Navigate to="/signIn" replace />;
  }

  return <>{children}</>;
}
