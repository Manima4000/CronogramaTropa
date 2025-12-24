import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './shared/layout/Layout';
import { HomePage } from './pages/Home/HomePage';
import { ScheduleListPage } from './pages/Schedule/ScheduleListPage';
import { ScheduleDetailPage } from './pages/Schedule/ScheduleDetailPage';
import { CreateSchedulePage } from './pages/Schedule/CreateSchedulePage';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './shared/ui/Toast/ToastContainer';
import { ROUTES } from './utils/constants/routes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ToastContainer />
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.schedules.list} element={<ScheduleListPage />} />
            <Route path={ROUTES.schedules.create} element={<CreateSchedulePage />} />
            <Route path={ROUTES.schedules.detailPattern} element={<ScheduleDetailPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
