// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import GuestDetails from './pages/GuestDetails';
import NewGuest from './pages/NewGuest';
import PortalPage from './pages/PortalPage';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AttendantDashboard from './pages/AttendantDashboard';
import AdminLogin from './pages/AdminLogin';
import OwnerLogin from './pages/OwnerLogin';
import AttendantLogin from './pages/AttendantLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rotas públicas de login/cadastro */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/owner" element={<OwnerLogin />} />
            <Route path="/login/attendant" element={<AttendantLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Todas as rotas abaixo estarão protegidas pela autenticação (e algumas também por role) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Rota padrão após o layout */}
              <Route index element={<Navigate to="/portal" replace />} />

              {/* Página Portal, visível para qualquer usuário autenticado */}
              <Route path="portal" element={<PortalPage />} />

              {/* Dashboard do Admin */}
              <Route
                path="admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard do Proprietário (Owner) */}
              <Route
                path="owner-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard do Attendant */}
              <Route
                path="attendant-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['attendant']}>
                    <AttendantDashboard />
                  </ProtectedRoute>
                }
              />

              {/* “Panel” propriamente dito (rota /dashboard), só Owner pode acessar */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Hóspedes — aqui você pode definir allowedRoles conforme necessidade.
                  Exemplo: se quiser que apenas admin ou owner vejam guests: */}
              <Route
                path="guests"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
                    <Guests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guests/new"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
                    <NewGuest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guests/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
                    <GuestDetails />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Quartos e Reservas — Exemplo: disponibilizar para todos os papéis */}
              <Route
                path="rooms"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <Rooms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reservations"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <Reservations />
                  </ProtectedRoute>
                }
              />

              {/* Rota de “owner-dashboard/financials” (caso ainda queira usar) */}
              <Route
                path="owner-dashboard/financials"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
