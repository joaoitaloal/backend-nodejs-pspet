import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globalstyles/index.css'
import App from './App.tsx'
import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import NavBar from './components/NavBar/NavBar.tsx'
import Leituras from './pages/leituras/Leituras.tsx'
import Alunos from './pages/alunos/Alunos.tsx'
import Provas from './pages/provas/Provas.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <p>Um erro ocorreu! <Link to={'/'}>Voltar para a página inicial</Link></p>,
        element: <NavBar/>,
        children: [
            {
              path: "",
              element: <App/>
            },
            {
              path: "leituras",
              element: <Leituras/>
            },
            {
              path: "alunos",
              element: <Alunos/>
            },
            {
              path: "provas",
              element: <Provas/>
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
