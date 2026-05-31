import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './pages/auth/Login.tsx'

const router = createBrowserRouter([
  {
    path: '/', 
    element: <App />
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
