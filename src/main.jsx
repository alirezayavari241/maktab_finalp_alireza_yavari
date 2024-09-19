import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ProductList from './post.jsx'
import LoginPage from './pages/Login.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <ProductList/>
    <LoginPage/> */}
  </StrictMode>,
)
