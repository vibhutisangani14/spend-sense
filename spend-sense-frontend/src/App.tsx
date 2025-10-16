import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AddExpense, Dashboard, EditExpense, SignIn, SignUp } from "./pages";
import { MainLayout } from "./layouts";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="editExpense" element={<EditExpense />} />
          <Route path="addExpense" element={<AddExpense />} />
        </Route>
        <Route path="*" element={<Navigate to="/signIn" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
