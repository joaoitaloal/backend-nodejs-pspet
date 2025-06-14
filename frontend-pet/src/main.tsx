import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import NavBar from './components/NavBar/NavBar.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <p>Um erro ocorreu! <Link to={'/'}>Voltar para a página inicial</Link></p>,
        element: <NavBar/>,
        children: [
            {
                path: "",
                element: <App/>
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
