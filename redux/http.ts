import axios from 'axios'
// import { baseUrl } from './utils/helpers'

const http = axios.create({
  baseURL: "https://backend-v6.onrender.com/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true
})

export default http
