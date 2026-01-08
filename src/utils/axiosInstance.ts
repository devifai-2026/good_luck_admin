import axios, { AxiosInstance } from "axios"

// https://goodluckserver.in/
const axiosInstance: AxiosInstance = axios.create({
    baseURL:'http://localhost:8002/good_luck/api/v1'
    // baseURL:'https://goodluckserver.in/good_luck/api/v1'
})

export default axiosInstance;