import { Routes, Route, Navigate } from "react-router-dom";
import {
  AddExpense,
  Dashboard,
  EditExpense,
  Profile,
  SignIn,
  SignUp,
} from "./pages";
import { MainLayout } from "./layouts";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signIn" replace />} />

      {/* auth routes */}
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />

      {/* protected (app) routes */}
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
        <Route path="editExpense/:id" element={<EditExpense />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/signIn" replace />} />
    </Routes>
  );
}
