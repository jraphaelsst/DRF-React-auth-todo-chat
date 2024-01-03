import { useContext } from 'react'

import axios from 'axios'
import dayjs from 'dayjs'
import jwt_decode from 'jwt-decode'

import AuthContext from '../context/AuthContext'


const baseUrl = 'http://localhost:8000/api'

const useAxios = () => {
    // Declare Context from AuthContext
    const { authTokens, setAuthTokens, setUser } = useContext(AuthContext)

    // Create a new Axios instance
    const axiosInstance = axios.create({
        baseUrl,
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    })

    // Initialize a request for a new Token using Axios Instance
    axiosInstance.interceptors.request.use(async req => {
        // Decode Access Token
        const user = jwt_decode(authTokens.access)
        // Check if Token is expired
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

        // If Token is expired, request a new one
        if (isExpired) return req

        // If not expired, return the Token itself
        const response = await axios.post(`${baseUrl}/token/refresh/`, {
            refresh: authTokens.refresh
        })

        // Save new authTokens to LocalStorage
        localStorage.setItem('authTokens', JSON.stringify(response.data))
        // localStorage.setItem('authTokens', JSON.stringify(response.data))

        // Save new authTokens to request
        setAuthTokens(response.data)
        // Decode new Access Token and set it to User
        setUser(jwt_decode(response.data.access))

        // Save new Access Token to request Headers
        req.headers.Authorization = `Bearer ${response.data.access}`

        return req
    })

    return axiosInstance
}

export default useAxios
