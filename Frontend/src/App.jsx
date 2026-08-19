import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage'
import UserPage from './Pages/UserPage';
import AdminPage from './Pages/AdminPage'
import ManageUsers from './Components/AdminPage/ManageUsers/ManageUsers';
import ManageVehicles from './Components/AdminPage/ManageVehicles/ManageVehicles';
import ManageDrivers from './Components/AdminPage/ManageDrivers/ManageDrivers';
import LoadFinishedTickets from './Components/AdminPage/ManageRequests/LoadFinishedTickets';

function getStoredUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

function ProtectedAdminRoute({ children }) {
  const user = getStoredUser();
  const accountType = user?.account_type?.toLowerCase();

  if (accountType !== 'admin') {
    if (accountType === 'user') {
      return <Navigate to="/user" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedUserRoute({ children }) {
  const user = getStoredUser();
  const accountType = user?.account_type?.toLowerCase();

  if (accountType !== 'user') {
    if (accountType === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  // basename="/Amkor_VehicleBooking_System_2026/Frontend"
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route
            path="/user"
            element={
              <ProtectedUserRoute>
                <UserPage />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/manageusers"
            element={
              <ProtectedAdminRoute>
                <ManageUsers />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/managevehicles"
            element={
              <ProtectedAdminRoute>
                <ManageVehicles />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/managedrivers"
            element={
              <ProtectedAdminRoute>
                <ManageDrivers />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/loadfinishedtickets"
            element={
              <ProtectedAdminRoute>
                <LoadFinishedTickets />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App