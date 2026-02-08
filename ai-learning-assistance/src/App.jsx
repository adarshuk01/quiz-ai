import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard'
import QuestionSets from './pages/QuestionSets'
import QuestionSetForm from './components/QuestionSets/QuestionSetForm'
import UploadPdf from './components/QuestionSets/UploadPdf'
import QuestionSetDetails from './pages/QuestionsList'
import Quiz from './pages/Quiz'
import QuizBasicInfo from './components/quiz/QuizForm'
import SignUp from './pages/Auth/SignUp'
import SignIn from './pages/Auth/Signin'
import QuizPage from './pages/QuizPage'
import QuizResult from './components/quiz/QuizResult'
import StartQuizCard from './components/quiz/StartQuizCard'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/question-sets' element={<QuestionSets />} />
          <Route path='/question-sets/:id' element={<QuestionSetDetails />} />

          <Route path='/question-sets/create-topic' element={<QuestionSetForm />} />
          <Route path='/question-sets/create-pdf' element={<UploadPdf />} />
          <Route path='/quizzes' element={<Quiz />} />
          <Route path='/quizzes/create' element={<QuizBasicInfo />} />
          <Route path="/quizzes/edit/:id" element={<QuizBasicInfo />} />




          <Route path='*' element={<>not found</>} />
        </Route>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/quiz/:code/attempt/:token' element={<QuizPage />} />
        <Route path="/quizresult/:id" element={<QuizResult />} />
        <Route path="/startquiz/:code" element={<StartQuizCard />} />



      </Routes>

    </>
  )
}

export default App
