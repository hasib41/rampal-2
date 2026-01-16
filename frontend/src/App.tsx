import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
import { AdminLayout } from './components/admin';
import {
  HomePage,
  ProjectsPage,
  ProjectDetailPage,
  DirectorsPage,
  CareersPage,
  ContactPage,
  SustainabilityPage,
  TendersPage,
  MediaPage,
  MediaDetailPage,
  NoticesPage,
  NoticeDetailPage,
} from './pages';
import {
  AdminDashboard,
  AdminNotices,
  AdminTenders,
  AdminDirectors,
  AdminProjects,
  AdminNews,
  AdminCareers,
  AdminSettings
} from './pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="directors" element={<DirectorsPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="sustainability" element={<SustainabilityPage />} />
            <Route path="tenders" element={<TendersPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="media/:slug" element={<MediaDetailPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="notices/:slug" element={<NoticeDetailPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="directors" element={<AdminDirectors />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="tenders" element={<AdminTenders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
