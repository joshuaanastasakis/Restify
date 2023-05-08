import {
    NavLink,
} from 'react-router-dom';
import {useState, useEffect, useCallback } from "react";

import api, {headerContent} from '../../services/API';

import './style.css'

export default function Profile() {
    const auth = false;

    const user = JSON.parse(localStorage.getItem("user"))

    const [editFirstLastBool, setEditFirstLast] = useState(false)
    const [editEmailBool, setEditEmail] = useState(false)
    const [editPhoneBool, setEditPhone] = useState(false)

    const [userInfo, setUserInfo] = useState(user)

    const handleFirstAndLast = event => {
        if (event.target.textContent === "Edit") {
            event.target.textContent = "Save"
            setEditFirstLast(true);
        }
        else if (event.target.textContent === "Save") {
            const first_last = document.getElementById("name_input").value.split(" ")
            const body = { ...userInfo, "first_name": first_last[0], "last_name": first_last[1]}
            if (first_last.length == 2) {

                api.patch(`accounts/profile/`, body, {headers: {...headerContent.json}})
                    .then(function(response) {
                        setUserInfo({ ...userInfo, "first_name": first_last[0], "last_name": first_last[1]});
                        localStorage.setItem("user", JSON.stringify(userInfo));
                    })
                setEditFirstLast(false);
                event.target.textContent = "Edit"
            } else {
                setEditFirstLast(false);
                event.target.textContent = "Edit"
            }
        }
    };

    const handleEmail = event => {
        if (event.target.textContent === "Edit") {
            event.target.textContent = "Save"
            setEditEmail(true);
        }
        else if (event.target.textContent === "Save") {
            const newEmail = document.getElementById("email_input").value
            const body = { ...userInfo, "email": newEmail}
            api.patch(`accounts/profile/`, body, {headers: {...headerContent.json}})
                    .then(function(response) {
                        setUserInfo({ ...userInfo, "email": newEmail});
                        localStorage.setItem("user", JSON.stringify(userInfo));
                    })

            setEditEmail(false);
            event.target.textContent = "Edit"
        }
    };

    const handlePhone = event => {
        if (event.target.textContent === "Edit") {
            event.target.textContent = "Save"
            setEditPhone(true);
        }
        else if (event.target.textContent === "Save") {
            
            const newPhone = document.getElementById("phone_input").value
            if (newPhone.length === 10) {
                const body = { ...userInfo, "phone": newPhone}
                api.patch(`accounts/profile/`, body, {headers: {...headerContent.json}})
                        .then(function(response) {
                            setUserInfo({ ...userInfo, "phone": newPhone});
                            localStorage.setItem("user", JSON.stringify(userInfo));
                        })
            }
            setEditPhone(false);
            event.target.textContent = "Edit"
        }
    };

    return (
        <div>
            <p className="account_title">Account Details</p>
            <div className="page_content">
                <div className="avatar">
                    <img src="../profilepage/portrait.jpg" id="avatar"></img>
                    <h3>Update Avatar</h3>
                </div>
                
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div className="row">
                        <div className="column" id="profile">
                            <span>First and last name</span>
                            <h6>{userInfo.first_name} {userInfo.last_name}</h6>
                            {editFirstLastBool && <input id="name_input"></input>}
                        </div>
                        <div className="column">
                            <button className="edit_button" id="firstAndLastEdit" onClick={handleFirstAndLast}>Edit</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column" id="profile">
                            <span>Email address</span>
                            <h6>{userInfo.email}</h6>
                            {editEmailBool && <input id="email_input"></input>}
                        </div>
                        <div className="column">
                            <button className="edit_button" id="emailEdit" onClick={handleEmail}>Edit</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column" id="profile">
                            <span>Phone number</span>
                            <h6>{userInfo.phone}</h6>
                            {editPhoneBool && <input id="phone_input"></input>}
                        </div>
                        <div className="column">
                            <button className="edit_button" id="phoneEdit" onClick={handlePhone}>Edit</button>
                        </div>
                    </div>
                    <a href="../profilepage/user own view.html" className="view_profile">View profile</a>
                </div>
            </div>
        </div>
    );
}




