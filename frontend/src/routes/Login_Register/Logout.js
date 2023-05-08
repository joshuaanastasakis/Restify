import {
    NavLink,
} from 'react-router-dom';
import {useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api, {headerContent} from '../../services/API';
import AuthContext from "../../contexts/AuthProvider";

import './style.css'
import { useAuth } from '../../hooks/useAuth';

function Logout() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    useEffect(() => {
        localStorage.removeItem("JWTaccess");
        localStorage.removeItem("user");
        localStorage.removeItem("hostMode");
        navigate("/accounts/login")
    }, [])
}

export default Logout;




