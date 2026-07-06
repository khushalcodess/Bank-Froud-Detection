import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';

// Admin imports
import Dashboard from './Admin/Dashboard';
import Transaction from './Admin/Transaction';
import Alert from './Admin/Alert';
import Users from './Admin/Users';
import Nav from './Components/Nav';
import Footer from './Components/Footer';

//  User imports
import UserDashboard from './User/Userdashboard';
import SendMoney from './User/SendMoney';
import MyTransactions from './User/MyTransactions';
import UserNav from './Components/UserNav';
import UserSidebar from './Components/UserSidebar';

// Admin Layout
function AdminLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

//  User Layout
function UserLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <UserNav />
      <div style={{ display: 'flex', flex: 1 }}>
        <UserSidebar />
        <div style={{ flex: 1, backgroundColor: "#f5f5f5", padding: "20px" }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        {/* Admin pages */}
        <Route element={<AdminLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Transactions" element={<Transaction />} />
          <Route path="/Alert" element={<Alert />} />
          <Route path="/Users" element={<Users />} />
        </Route>

        {/*  User pages */}
        <Route element={<UserLayout />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/send-money" element={<SendMoney />} />
          <Route path="/my-transactions" element={<MyTransactions />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;