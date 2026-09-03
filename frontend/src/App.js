import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";

import AdminLayout from "./Components/layout/AdminLayout";
import UserLayout from "./Components/layout/UserLayout";

// Landing
import LandingPage from "./pages/landing/LandingPage";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Transactions from "./pages/admin/Transactions";
import Alerts from "./pages/admin/Alerts";
import Users from "./pages/admin/Users";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import SendMoney from "./pages/user/SendMoney";
import MyTransactions from "./pages/user/MyTransactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route
            path="/Dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/Transactions"
            element={<Transactions />}
          />

          <Route
            path="/Alert"
            element={<Alerts />}
          />

          <Route
            path="/Users"
            element={<Users />}
          />
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route
            path="/user-dashboard"
            element={<UserDashboard />}
          />

          <Route
            path="/send-money"
            element={<SendMoney />}
          />

          <Route
            path="/my-transactions"
            element={<MyTransactions />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;