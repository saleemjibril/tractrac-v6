import axios from 'axios'
// import { baseUrl } from './utils/helpers'

const http = axios.create({
  baseURL: "https://tractrac.iiimpact.org/v1",
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true
})

export default http
