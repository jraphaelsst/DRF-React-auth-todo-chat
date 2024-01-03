import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import Homepage from './views/Homepage'
import Loginpage from './views/Loginpage'
import Registerpage from './views/Registerpage'
import Dashboard from './views/Dashboard'
import Navbar from './views/Navbar'


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
          </Routes>
        </Fragment>
      </AuthProvider>
    </Router>
  )
}

export default App