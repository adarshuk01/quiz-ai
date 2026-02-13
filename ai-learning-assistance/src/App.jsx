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
import NotFound from './pages/NotFound'
import QuizDetails from './pages/QuizDetails'
import ReviewPage from './pages/ReviewPage'
import MyProfile from './pages/settings/MyProfile'
import SecuritySettings from './pages/settings/SecuritySettings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
         <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/question-sets' element={<QuestionSets />} />
          <Route path='/question-sets/:id' element={<QuestionSetDetails />} />

          <Route path='/question-sets/create-topic' element={<QuestionSetForm />} />
          <Route path='/question-sets/create-pdf' element={<UploadPdf />} />
          <Route path='/quizzes' element={<Quiz />} />
          <Route path='/quizzes/create' element={<QuizBasicInfo />} />
          <Route path="/quizzes/edit/:id" element={<QuizBasicInfo />} />

          <Route path='/quizdetails/:quizId' element={<QuizDetails />} />
          <Route path='/profile' element={<MyProfile />} />
          <Route path='/security' element={<SecuritySettings />} />




          <Route path='*' element={<NotFound />} />
          </Route>
        </Route>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/quiz/:code/attempt/:token' element={<QuizPage />} />
        <Route path="/quizresult/:id" element={<QuizResult />} />
        <Route path="/startquiz/:code" element={<StartQuizCard />} />
        <Route path="/quizresult/:attemptId/answers" element={<ReviewPage />} />


      </Routes>

    </>
  )
}

export default App
