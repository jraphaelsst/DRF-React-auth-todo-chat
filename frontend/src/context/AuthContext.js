import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
//ts-ignore
import { jwtDecode } from "jwt-decode"

const swal = require('sweetalert2')

/**
 *  This import method solved the problem I was  
 *  having while importing the traditional way
 */
// const { default: jwt_decode } = require('jwt-decode')

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {

    // Instancialize state management for AuthTokens 
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    )

    // Instancialize state management for User
    const [user, setUser] = useState(() =>
        localStorage.getItem('authTokens')
            ? jwtDecode(localStorage.getItem('authTokens'))
            : null
    )


    /**
     *  Instancialize state management for Loading
     *  when users are not yet loaded from LocalStorage
     */
    const [loading, setLoading] = useState(true)

    /**
     *  Instancialize useHistory hook to forward users
     *  through pages when some action is completed
     */
    const navigate = useNavigate()

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
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/home')
            swal.fire({
                title: 'Login Successful',
                icon: 'success',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButtom: false,
            })
        } else {
            console.log(response.status);
            console.log('There was a server issue.')
            swal.fire({
                title: 'Username or password does not exist.',
                icon: 'error',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButtom: false,
            })
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
            navigate('/login')
        } else {
            console.log(response.status);
            console.log('There was a server issue.')
            swal.fire({
                title: 'An error occurred.',
                icon: 'error',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButtom: false,
            })
        }
    }

    // Function to perform user's Logout
    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    /**
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

    /**
     *  Verify is authTokens already exists. If so
     *  setUser is called to bring up the respective
     *  User to that specific Access Token
     */
    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    /**
     *  Return AuthContext Provider containing contextData
     *  declared above with this Context's functionalities
     */
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
