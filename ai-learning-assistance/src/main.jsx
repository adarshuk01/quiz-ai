import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QuestionSetProvider } from './context/QuestionSetContext.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GroupProvider } from './context/GroupContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QuestionSetProvider>
      <QuizProvider>
        <AuthProvider>
          <GroupProvider>
    <App />
    </GroupProvider>
    </AuthProvider>
    </QuizProvider>
    </QuestionSetProvider>
    </BrowserRouter>
  </StrictMode>,
)
