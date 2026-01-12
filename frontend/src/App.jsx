import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Register from './components/Register';
import Rooms from './components/Rooms';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<PrivateRoute> <Rooms /> </PrivateRoute>}/>

        <Route
          path="/"
          element={<h2>Bienvenido al sistema de reservas</h2>}
        />
      </Routes>
    </>
  );
}

export default App;
