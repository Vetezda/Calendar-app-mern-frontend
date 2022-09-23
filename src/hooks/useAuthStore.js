import { useSelector, useDispatch } from "react-redux";
import { calendarApi } from "../api/";
import { onLogin, onChecking, 
         onLogout, 
         clearErrorMessage, 
         onLogoutClearCalendar } from "../store";



export const useAuthStore = () => {

    const dispatch = useDispatch();

    const { status, user, errorMessage } = useSelector( state => state.auth );

    const startLogin = async({email, password}) => {

        dispatch( onChecking() );

        try {

            const { data } = await calendarApi.post('/auth', {email, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            console.log(data);
            dispatch(onLogin( { name: data.name, uid: data.uid } ));

        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            },10);


        }
    }

    const startRegister = async({name, email, password}) => {

        dispatch( onChecking() );

        try {
            const {data} = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin( { name: data.name, uid: data.uid } ));

            console.log(data);

        } catch (error) {
            console.log(error);
            dispatch( onLogout( error.response.data.errors[0].msg || '--' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            },10);
        }
    }

    const startCheckingAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout() );

        try {
            const {data} = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin( { name: data.name, uid: data.uid } ));

        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        } 

    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogoutClearCalendar() );
        dispatch( onLogout() );
    }

    return{
        //* Propiedades
        status, 
        user, 
        errorMessage,
        
        //* Métodos
        startLogin,
        startRegister,
        startCheckingAuthToken,
        startLogout,
    }   

}