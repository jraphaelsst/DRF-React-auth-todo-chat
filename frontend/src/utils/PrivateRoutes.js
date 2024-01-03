import { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'

import AuthContext from '../context/AuthContext'


const PrivateRoute = ({ children, ...rest }) => {
    let { user } = useContext(AuthContext)
    return <Route {...rest}>{!user ? <Redirect to='/login' /> : children}</Route>
}
