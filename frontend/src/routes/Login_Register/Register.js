import {
    NavLink,
} from 'react-router-dom';
import {useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import api, {headerContent} from '../../services/API';

import './style.css'

export default function Register() {
    const navigate = useNavigate();
    const firstname = document.getElementById("first_name")
    const lastname = document.getElementById("last_name")
    const username = document.getElementById("username")
    const email = document.getElementById("email")
    const phone = document.getElementById("phone")
    const password1 = document.getElementById("password1")
    const password2 = document.getElementById("password2")
    const firstname_notification = document.getElementById("first_name_notification")
    const lastname_notification = document.getElementById("last_name_notification")
    const username_notification = document.getElementById("username_notification")
    const email_notification = document.getElementById("email_notification")
    const phone_notification = document.getElementById("phone_notification")
    const password1_notification = document.getElementById("password1_notification")
    const password2_notification = document.getElementById("password2_notification")

    const [fieldErrors, setFieldErrors] = useState({
        "first_name": true,
        "last_name": true,
        "username": true,
        "email": true,
        "phone": true,
        "password1": true,
        "password2": true
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const fields = [firstname, lastname, username, email, phone, password1, password2]
        const notification_fields = [firstname_notification, lastname_notification, username_notification, email_notification, phone_notification, password1_notification, password2_notification]  
        let error_found = false  

        for (var field in fieldErrors) {
            if (!fieldErrors[field]) {
                error_found = true
                document.getElementById("error").textContent = "At least one field is invalid. Please correct it before proceeding"
            }
        }
        if (!error_found) {
            try {
                const body = {
                    first_name: firstname.value,
                    last_name: lastname.value,
                    username: username.value,
                    email: email.value,
                    password1: password1.value,
                    password2: password2.value,
                    phone: phone.value
                };
                await api.post(`accounts/register/`, body, headerContent.json)
                    .then(function(response) {
                        if (response.status === 201) {
                            navigate("../accounts/login");
                        }
                    })
            } catch (err) {
                console.log(err)
                document.getElementById("error").textContent = "Username or email already taken"
            }
        }
    };

    return (
        <div className="login-card">
            <h2>
                Welcome to Restify
            </h2>
            <form className="login-form" id="register_form" onSubmit={handleSubmit}>
                <label className="form_header">First name</label>
                <input className="form_input" id="first_name" type="text" name="first-name" onChange={ValidateFirst} required></input>
                <p className="notification" id="first_name_notification" hidden={true}>First name can only contain letters</p>

                <label className="form_header">Last name</label>
                <input className="form_input" id="last_name" type="text" name="last-name" onChange={ValidateLast} required></input>
                <p className="notification" id="last_name_notification" hidden={true}>Last name can only contain letters</p>

                <label className="form_header">Username</label>
                <input className="form_input" id="username" type="text" name="username" onChange={ValidateUsername} required></input>
                <p className="notification" id="username_notification" hidden={true}>Username is invalid</p>

                <label className="form_header">Email</label>
                <input className="form_input" id="email" type="text" name="email" onChange={ValidateEmail} required></input>
                <p className="notification" id="email_notification" hidden={true}>Email is invalid</p>

                <label className="form_header">Phone</label>
                <input className="form_input" id="phone" type="text" name="phone" onChange={ValidatePhone} required></input>
                <p className="notification" id="phone_notification" hidden={true}>Phone is invalid</p>

                <label className="form_header">Password</label>
                <input className="form_input" id="password1" type="password" name="password" onChange={ValidatePassword} required></input>
                <p className="notification" id="password1_notification" hidden={true}>Password is invalid</p>

                <label className="form_header">Confirm password</label>
                <input className="form_input" id="password2" type="password" name="confirm-password" onChange={ValidatePassword2} required></input>
                <p className="notification" id="password2_notification" hidden={true}>Passwords don't match</p>

                <input className="login-button" id="submit" type="submit" value={"Register"}></input>
            </form>

            <span className="error" id="error"></span>

            <div style={{display: "flex", flexDirection: "row"}}>
                <p>Already have an account? </p>
                <NavLink as="a" to="/accounts/login" className="register-link">
                    <div>Login</div>
                </NavLink>
            </div>
        </div>
    );

    function ValidateFirst(event) {
        if (/^[a-zA-Z]{1,}$/.test(event.target.value)) {
            document.getElementById("first_name_notification").hidden = true
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "first_name": true });
        }
        else {
            document.getElementById("first_name_notification").hidden = false
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "first_name": false });
        }
    }

    function ValidateLast(event) {
        if (/^[a-zA-Z]{1,}$/.test(event.target.value)) {
            document.getElementById("last_name_notification").hidden = true
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "last_name": true });
        }
        else {
            document.getElementById("last_name_notification").hidden = false
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "last_name": false });
        }
    }

    function ValidateUsername(event) {
        if (/^\w{6,}$/.test(event.target.value)) {
            document.getElementById("username_notification").hidden = true
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "username": true });
        }
        else {
            document.getElementById("username_notification").hidden = false
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "username": false });
        }
    }
    
    function ValidateEmail(event) {
        if (/^(?!.*\.{2})[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(event.target.value)) {
            document.getElementById("email_notification").hidden = true
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "email": true });
        }
        else {
            document.getElementById("email_notification").hidden = false
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "email": false });
        }
    }
    
    function ValidatePhone(event) 
    {
        if (/^\d{10}$/.test(event.target.value)) {
            document.getElementById("phone_notification").hidden = true
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "phone": true });
        }
        else {
            document.getElementById("phone_notification").hidden = false
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "phone": false });
        }
    }
    
    function ValidatePassword(event) 
    {
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_]{8,}$/.test(event.target.value)) {
            document.getElementById("password1_notification").hidden = true
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "password1": true });
        }
        else {
            document.getElementById("password1_notification").hidden = false
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "password1": false });
        }
        if (document.getElementById("password1").value !== document.getElementById("password2").value) {
            document.getElementById("password2_notification").hidden = false
            document.getElementById("password2").style.backgroundColor = 'red'
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "password2": false });
        }
        else {
            document.getElementById("password2_notification").hidden = true
            document.getElementById("password2").style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "password2": true });
        }
    }
    
    function ValidatePassword2(event)
    {
        if (document.getElementById("password1").value === document.getElementById("password2").value) {
            document.getElementById("password2_notification").hidden = true
            if (document.getElementById("password1_notification").hidden == true) {
                document.getElementById("password1").style.backgroundColor = 'white'
                setFieldErrors({ ...fieldErrors, "password1": true });
            }
            event.target.style.backgroundColor = 'white'
            setFieldErrors({ ...fieldErrors, "password2": true });
        }
        else {
            document.getElementById("password2_notification").hidden = false
            document.getElementById("password1").style.backgroundColor = 'red'
            event.target.style.backgroundColor = 'red'
            setFieldErrors({ ...fieldErrors, "password1": false });
            setFieldErrors({ ...fieldErrors, "password2": false });
        }
    }
}
