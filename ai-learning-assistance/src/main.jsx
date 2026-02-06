import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QuestionSetProvider } from './context/QuestionSetContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QuestionSetProvider>
    <App />
    </QuestionSetProvider>
    </BrowserRouter>
  </StrictMode>,
)
