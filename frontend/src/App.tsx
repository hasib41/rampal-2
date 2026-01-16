import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
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
} from './pages';

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
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
