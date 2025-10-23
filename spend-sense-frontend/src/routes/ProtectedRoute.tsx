import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token =
    localStorage.getItem("spendsense_token") ||
    sessionStorage.getItem("spendsense_token");

  if (!token) {
    return <Navigate to="/signIn" replace />;
  }

  return <>{children}</>;
}
