import axios from "axios"
import { useContext } from "react"
import { AuthenticationContext } from "../app/context/AuthContext"
import { deleteCookie } from "cookies-next"

const useAuth = () => {

    const { setAuthState } = useContext(AuthenticationContext)
    const signin = async (email: string, password: string, handleClose: () => void) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        })
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password
            })
            if(response.status === 200){
                console.log("here");
                
            setAuthState({
                data: response.data,
                error: null,
                loading: false
            })
            handleClose()
        }
        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            })
        }
    }

    const signup = async (firstName: string, lastName: string, city: string, phone: string, email: string, password: string, handleClose: any) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        })
        try {
            const response = await axios.post("http://localhost:3000/api/auth/signup", {
                email,
                password,
                firstName,
                lastName,
                city,
                phone
            })
            if (response.data) {
                setAuthState({
                    data: response.data,
                    error: null,
                    loading: false
                })
                handleClose()
            }
        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            })
        }
    }

    const signout = () => {
        deleteCookie("jwt")
        setAuthState({
            data: null,
            error: null,
            loading: false
        })
    }

    return {
        signin,
        signup,
        signout
    }
}

export default useAuth