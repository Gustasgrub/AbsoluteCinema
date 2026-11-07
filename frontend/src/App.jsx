import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StudioPage from './pages/StudioPage.jsx';
import StudiosPage from './pages/StudiosPage.jsx';

// Visi frontend puslapiai (adresai atkartoja API hierarchiją: studija → filmas)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="studios" element={<StudiosPage />} />
        <Route path="studios/:studioId" element={<StudioPage />} />
        <Route path="studios/:studioId/movies/:movieId" element={<MoviePage />} />
        <Route path="catalogue" element={<CataloguePage />} />
        <Route path="users/:userId" element={<ProfilePage />} />
        <Route path="admin/users" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
