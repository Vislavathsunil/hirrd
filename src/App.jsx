import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

// Theme provider
import { ThemeProvider } from './components/ui/theme-provider'


// all routes
import Applayouts from './layouts/app-layouts'
import LandingPage from './pages/landing'
import Onboarding from './pages/onboarding'
import JobPage from './pages/job'
import JobList from './pages/job-listing'
import PostJobs from './pages/post-jobs'
import SavedJobs from './pages/saved-jobs'
import MyJobs from './pages/my-jobs'
import ProtectedRoute from './components/Protected-user';

const router = createBrowserRouter([
  {
    element: <Applayouts />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/onboarding",
        element:
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
      },
      {
        path: "/jobs",
        element:
          <ProtectedRoute>
            <JobList />
          </ProtectedRoute>
      },
      {
        path: "/job/:id",
        element:
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
      },
      {
        path: "/post-job",
        element:
          <ProtectedRoute>
            <PostJobs />
          </ProtectedRoute>
      },

      {
        path: "/saved-jobs",
        element:
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>,
      },
      {
        path: "/my-job",
        element:
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
      },
    ],
  },
]);


function App() {
  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
