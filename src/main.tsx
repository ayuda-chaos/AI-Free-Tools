import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../javascript .tsx'
import './style.css'

const root = document.getElementById('app')!
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
