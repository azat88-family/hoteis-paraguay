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
import RoomMaintenancePage from './pages/RoomMaintenancePage'; // Import the new page
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} /> {/* Simple unauthorized page */}


            {/* Todas as rotas abaixo estarão protegidas pela autenticação (e algumas também por role) */}
            <Route
              path="/"
              element={
                <ProtectedRoute> {/* Ensures user is authenticated for any route within Layout */}
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Rota padrão após o layout */}
              <Route index element={<Navigate to="/portal" replace />} />

              {/* Página Portal, visível para qualquer usuário autenticado */}
              <Route path="portal" element={<PortalPage />} /> {/* No specific role needed, just auth */}

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
                  <ProtectedRoute allowedRoles={['owner', 'admin']}> {/* Admin can also see owner dashboard */}
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard do Attendant */}
              <Route
                path="attendant-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['attendant', 'admin']}> {/* Admin can also see attendant dashboard */}
                    <AttendantDashboard />
                  </ProtectedRoute>
                }
              />

              {/* “Panel” propriamente dito (rota /dashboard), Admin ou Owner podem acessar */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Hóspedes */}
              <Route
                path="guests"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <Guests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guests/new"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <NewGuest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guests/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <GuestDetails />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Quartos */}
              <Route
                path="rooms"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <Rooms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rooms/:id/maintenance"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <RoomMaintenancePage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Reservas */}
              <Route
                path="reservations"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    <Reservations />
                  </ProtectedRoute>
                }
              />
               {/* Route for creating a new reservation, BookingModal might be triggered from here or other places */}
              <Route
                path="reservations/new"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'attendant']}>
                    {/* This could be a page that opens BookingModal or a dedicated page */}
                    {/* For now, let's assume Reservations.tsx handles modal opening or it's a page */}
                    <Reservations /> {/* Or a specific NewReservationPage that uses BookingModal */}
                  </ProtectedRoute>
                }
              />


              {/* Rota de “owner-dashboard/financials” (caso ainda queira usar) */}
              <Route
                path="owner-dashboard/financials"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <OwnerDashboard /> {/* Assuming this is a sub-section of owner's view */}
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

// Simple Unauthorized Page Component
const UnauthorizedPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
    <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
    <p className="mb-8">You do not have permission to access this page.</p>
    <Link to="/portal" className="text-blue-400 hover:underline">Go to Portal</Link>
  </div>
);

export default App;
