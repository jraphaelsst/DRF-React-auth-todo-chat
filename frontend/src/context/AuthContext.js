import { createContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import jwt_decode from 'jwt-decode'


const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {

    // Instancialize state management for AuthTokens 
    const [authTokens, setAuthTokens] = useState(() => {
        // eslint-disable-next-line no-unused-expressions
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    })

    // Instancialize state management for User
    const [user, setUser] = useState(() => {
        // eslint-disable-next-line no-unused-expressions
        localStorage.getItem('authTokens')
            ? jwt_decode(localStorage.getItem('authTokens'))
            : null
    })

    /*
     *  Instancialize state management for Loading
     *  when users are not yet loaded from LocalStorage
     */
    const [loading, setLoading] = useState(true)

    /*
     *  Instancialize useHistory hook to forward users
     *  through pages when some action is completed
     */
    const history = useHistory()

    // Function to perform user's Login
    const loginUser = async (email, password) => {

        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })

        const data = await response.json()
        console.log(data);

        if (response.status === 200) {
            console.log('Logged in.');
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            history.push('/')
        } else {
            console.log(response.status);
            console.log('There was a server issue.')
            alert('Something went wrong' + response.status)
        }
    }

    // Function to Register new users to database
    const registerUser = async (email, username, password, password2) => {

        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })

        if (response.status === 201) {
            history.push('/login')
        } else {
            console.log(response.status);
            console.log('There was a server issue.')
            alert('Something went wrong' + response.status)
        }
    }

    // Function to perform user's Logout
    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/login')
    }

    /*
     *  Object containing all other functions
     *  declared in this context
     */
    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser
    }

    /*
     *  Verify is authTokens already exists. If so
     *  setUser is called to bring up the respective
     *  User to that specific Access Token
     */
    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    /*
     *  Return AuthContext Provider containing contextData
     *  declared above with this Context's functionalities
     */
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
