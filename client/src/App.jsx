import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login/Login';
import RegisterOrg from './pages/RegisterOrg/RegisterOrg';
import Employees from './pages/Employees/Employees';
import Teams from './pages/Teams/Teams';
import Logs from './pages/Logs/Logs';

import Layout from './components/Layout/Layout';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterOrg />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/employees" />} />
            <Route path="employees" element={<Employees />} />
            <Route path="teams" element={<Teams />} />
            <Route path="logs" element={<Logs />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
