import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import MyReservations from './components/MyReservations';
import Favorites from './components/Favorites';
import RoomDetail from './components/RoomDetail';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user } = useContext(AuthContext);

  // Auth pages — no sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-carbon">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }

  // Logged in — sidebar layout
  return (
    <div className="min-h-screen bg-carbon flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
          <Route path="/rooms/:id" element={<PrivateRoute><RoomDetail /></PrivateRoute>} />
          <Route path="/reservations" element={<PrivateRoute><MyReservations /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          {user?.role === 'admin' && (
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          )}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
