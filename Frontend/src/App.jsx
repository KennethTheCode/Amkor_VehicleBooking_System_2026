import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage'
import UserPage from './Pages/UserPage';
import AdminPage from './Pages/AdminPage'
import ManageUsers from './Components/AdminPage/ManageUsers/ManageUsers';
import ManageVehicles from './Components/AdminPage/ManageVehicles/ManageVehicles';
import ManageDrivers from './Components/AdminPage/ManageDrivers/ManageDrivers';

function App() {
  return (
    <div>
      <Router basename="/Amkor_VehicleBooking_System_2026/Frontend">
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/user" element={<UserPage/>} />
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/manageusers" element={<ManageUsers/>} />
          <Route path="/managevehicles" element={<ManageVehicles/>} />
          <Route path="/managedrivers" element={<ManageDrivers/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App