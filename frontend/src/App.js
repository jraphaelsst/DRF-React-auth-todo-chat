import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'

import Dashboard from './views/Dashboard'
import Homepage from './views/Homepage'
import Loginpage from './views/Loginpage'
import Navbar from './views/Navbar'
import Registerpage from './views/Registerpage'
import Todo from './views/Todo'


function App() {
  return (
    <Router>
      <AuthProvider>
        <Fragment>
          <Navbar/>
          <Routes>
            <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path='/register' element={<Registerpage />}/>
            <Route path='/login' element={<Loginpage />}/>
            <Route path='/home' element={<PrivateRoute><Homepage /></PrivateRoute>} />
            <Route path='/todo' element={<PrivateRoute><Todo /></PrivateRoute>} />
          </Routes>
        </Fragment>
      </AuthProvider>
    </Router>
  )
}

export default App