import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth/pages/LoginPage"
import { CalendarPage } from "../calendar/pages/CalendarPage"
import { useAuthStore } from "../hooks";


export const AppRouter = () => {

    const { status, startCheckingAuthToken } = useAuthStore();
    //const authStatus = 'not-authenticated';

    useEffect( () => {
        startCheckingAuthToken();
    }, [])
    
    if ( status === 'checking' ) {
        return <h1>Espere...</h1>
    }


    return (
        <Routes>
            {
                ( status === 'not-authenticated')
                    ?(
                        <>
                            <Route path="/auth/*" element={<LoginPage />} />
                            <Route path="/*" element={<Navigate to="/auth/login" />} />
                        </>
                    ) 
                    : (
                        <>
                            <Route path="/" element={<CalendarPage />} />
                            <Route path="/*" element={<Navigate to="/" />} />
                        </>
                    )

            }

            <Route path="/*" element={<Navigate to="/auth/login" />} />

        </Routes>
  )
}
