import { Routes, Route, Navigate } from "react-router-dom";
import { AddExpense, Dashboard, EditExpense, SignIn, SignUp } from "./pages";
import { MainLayout } from "./layouts";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* redirect root to signIn */}
      <Route path="/" element={<Navigate to="/signIn" replace />} />

      {/* auth routes */}
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />

      {/* protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="addExpense" element={<AddExpense />} />
      </Route>

      <Route path="/editExpense/:id" element={<EditExpense />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/signIn" replace />} />
    </Routes>
  );
}
