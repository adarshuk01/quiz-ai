import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard'
import QuestionSets from './pages/QuestionSets'
import QuestionSetForm from './components/QuestionSets/QuestionSetForm'
import UploadPdf from './components/QuestionSets/UploadPdf'
import QuestionSetDetails from './pages/QuestionsList'

function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/question-sets' element={<QuestionSets/>} />
          <Route path='/question-sets/:id' element={<QuestionSetDetails/>} />

        <Route path='/question-sets/create-topic' element={<QuestionSetForm/>} />
         <Route path='/question-sets/create-pdf' element={<UploadPdf/>}/>
        <Route path='*' element={<>not found</>}/>
      </Route>
    </Routes>
    
    </>
  )
}

export default App
