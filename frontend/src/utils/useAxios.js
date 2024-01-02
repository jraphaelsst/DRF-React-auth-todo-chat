import { useContext } from 'react'

import axios from 'axios'
import dayjs from 'dayjs'
import jwt_decode from 'jwt-decode'

import AuthContext from '../context/AuthContext'


const baseUrl = 'http://localhost:8000/api'

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)
}
