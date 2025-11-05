import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { HomePage } from './pages/Home/HomePage'
import { ServiceDetailPage } from './pages/ServiceDetail/ServiceDetailPage'
import DocumentChecklistPage from './components/chatbot/DocumentChecklistPage'
import { SignupPage } from './pages/Auth/SignupPage'
import { LoginPage } from './pages/Auth/LoginPage'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/services/:serviceId', element: <ServiceDetailPage /> },
      { path: '*', element: <HomePage /> },
      { path: '/services/:serviceId/checklist', element: <DocumentChecklistPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}

export default App
