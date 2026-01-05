import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './shared/layout/Layout';
import { HomePage } from './pages/Home/HomePage';
import { ScheduleListPage } from './pages/Schedule/ScheduleListPage';
import { ScheduleDetailPage } from './pages/Schedule/ScheduleDetailPage';
import { CreateSchedulePage } from './pages/Schedule/CreateSchedulePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './shared/ui/Toast/ToastContainer';
import { ROUTES } from './utils/constants/routes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.login} element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path={ROUTES.home} element={<HomePage />} />
                <Route path={ROUTES.schedules.list} element={<ScheduleListPage />} />
                <Route path={ROUTES.schedules.create} element={<CreateSchedulePage />} />
                <Route path={ROUTES.schedules.detailPattern} element={<ScheduleDetailPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
