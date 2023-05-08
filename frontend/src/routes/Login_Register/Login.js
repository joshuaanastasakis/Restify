import {
    NavLink,
} from 'react-router-dom';
import {useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api, {headerContent} from '../../services/API';
import AuthContext from "../../contexts/AuthProvider";

import './style.css'
import { useUser } from '../../hooks/useUser';

function Login() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const testAuth = async (e) => {
        e.preventDefault();
        try {
            const body = {
                "address": "123 miami street",
                "city": "Miami",
                "province": "Florida",
                "postal": "M5M5M5",
                "country": "USA",
                "max_guests": 3,
                "num_bed": 2,
                "num_bath": 1,
                "name": "The Miami house",
                "description": "This is a place in Miami, Florida that is very nice and you should rent it.",
                "amenities": ["kitchen", "fireplace"]
            }
            // (url, body, headers)
            /*
                {headers: {...}
             */
            await api.post(`properties/create/`, body, headerContent.json)
                .then(function(response) {
                    console.log("user logged in")
                })
        } catch (err) {
            console.log("user not logged in")
        }
    }

    const handleSubmit = async (e) => {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const errorField = document.getElementById("error")
        e.preventDefault();
        try {
            const body = {username, password};
            await api.post(`accounts/api/token/`, body, headerContent.json)
                .then(function(response) {
                    if (response.status === 200) {
                        let token = response.data;
                        localStorage.setItem("JWTaccess", JSON.stringify(token));
                        const user = api.get(`accounts/profile/`, headerContent.json)
                                        .then(function(response) {
                                            localStorage.setItem("user", JSON.stringify(response.data));
                                            console.log(response.data)
                                            localStorage.setItem("hostMode", false);
                                        })
                        
                        navigate("/");
                    }
                })
        } catch (err) {
            errorField.textContent = "Username or password is invalid"
        }
    };

    return (
        <div className="login-card">
            <h2>
                Welcome to Restify
            </h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label className="form_header">Username</label>
                <input className="form_input" id="username" type="text" required></input>

                <label className="form_header">Password</label>
                <input className="form_input" id="password" type="password" required></input>

                <input className="login-button" type="submit" value={"Login"}></input>
            </form>

            <span className="error" id="error"></span>

            <div style={{display: "flex", flexDirection: "row"}}>
                <p>New to Restify? </p>
                <NavLink as="a" to="/accounts/register" className="register-link">
                    <div>Register</div>
                </NavLink>
            </div>   
        </div>
    );
}

export default Login;




