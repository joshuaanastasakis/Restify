import { useContext } from "react";
import { AuthProvider } from '../contexts/AuthProvider'
import { useLocalStorage } from "./useLocalStorage";

/*
stored user object field
{
    id: string,
    name: string,
    email: string,
    authToken: string,
}
*/

export const useUser = () => {
    const user = useContext(AuthProvider);
    const { setItem } = useLocalStorage();

    const addUser = (user) => {
        setItem('user', JSON.stringify(user));
        console.log("user:", user)
    };

    const removeUser = () => {
        setItem('user', '');
    }

    return { user, addUser, removeUser };
}