import axios from "axios";
import { getEnvVariables } from "../helpers";


const { VITE_API_URL } = getEnvVariables();

export const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

//Configuración de interceptores
calendarApi.interceptors.request.use( async (config) => {
    const token = localStorage.getItem('token');//extraemos el token que se guardó en localStorage, token que credo desde el backend
    if(token){
        config.headers = {
            ...config.headers,//por si hay mas headers
            'x-token': token
        }
    }
    return config;
});


export default calendarApi;


