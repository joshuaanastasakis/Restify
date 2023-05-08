import { useLocation, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";

import NavbarItem from "./NavbarItem";
import './style.css';
import api, {headerContent} from "../../services/API";

export default function Navbar({unreadNotifications}) {
    const [user, setUser] = useState(null)
    const [hostMode, setHostMode] = useState(false)
    const navigate = useNavigate();
    
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const location = useLocation();

    const toggleHost = (e) => {
        setHostMode(!hostMode)
        localStorage.setItem("hostMode", hostMode);
        navigate("/")
    }

    const createProperty = (e) => {
        const body = {
            "address": "ADDRESS",
            "city": "CITY",
            "province": "PROVINCE/STATE",
            "postal": "POSTAL",
            "country": "COUNTRY",
            "max_guests": 1,
            "num_bed": 1,
            "num_bath": 1,
            "name": "NAME",
            "description": "DESCRIPTION",
            "amenities": []
        }
        api.post(`properties/create/`, body, headerContent.json)
            .then(res => res.data)
            .then(data => {
                // navigate(`/properties/${data.id}`)
            })
            .catch(e => {
                console.log(e)
            })
    }

    useEffect(() => {
        const userJSON = JSON.parse(localStorage.getItem("user"));
        setUser(userJSON)
        const hostModeJSON = localStorage.getItem("hostMode");
        setHostMode(hostModeJSON)
        // const user = null;
        console.log("navbar:", user)
    }, []);

    return (
        <header>
            <div id="logo-container">
                <a id="logo" className="nav desktop">Restify</a>
                {user && user.isHost && hostMode && <span id="user-type-label">host</span>}
            </div>
            <div id="header-search-container" className="mobile">
                {user && !hostMode && <>
                    <a id="search-button" href="../search_filter/search.html">
                        <i id="search-button-icon" className="fa-regular fa-magnifying-glass fa-2x"></i>
                        <span id="search-button-label">Search</span>
                    </a>
                    <a id="filter-button" href="../search_filter/filter.html">
                        <i id="filter-button-icon" className="fa-regular fa-sliders-simple fa-2x"></i>
                        <span id="filter-button-label">Filter</span>
                    </a></>}
            </div>
            <div id="account-selector-container" className="desktop">
                {user &&
                <NavLink as="a" to="/notifications" id="notification-button">
                    {unreadNotifications && <span className="new-notifications-count"></span>}
                    <i id="notification-button-icon" className="fa-regular fa-bell fa-2x"></i>
                </NavLink>}
                <button id="account-selector" className="desktop" onClick={() => setDropdownVisible(!dropdownVisible)}>
                    <i className="fa-solid fa-bars"></i>
                    <i className="fa-regular fa-circle-user fa-2x"></i>
                </button>
                {dropdownVisible && <div className="dropdown" id="account-dropdown">
                    <div id="dropdown-nav-section" className="dropdown-section">
                        {!hostMode && <NavbarItem title="Explore" link='/' />}
                        {user && <NavbarItem title="Notifications" link='/notifications' />}
                        {user && !hostMode && <NavbarItem title="Trips" link='/reservations' />}
                        {user && hostMode && <NavbarItem title="Reservations" link='/reservations' />}
                        {user && user.isHost && hostMode && <NavbarItem title="Listings" link='/listings' />}
                        {user && <NavLink className="dropdown-item" onClick={(e) => createProperty(e)} >Create Property</NavLink>}
                    </div>
                    <div className="horizontal-divider"></div>
                    <div id="dropdown-admin-section" className="dropdown-section">
                        {user && user.isHost && hostMode && <NavbarItem title="Switch to User" onClick={toggleHost}/>}
                        {user && user.isHost && !hostMode && <NavbarItem title="Switch to Host" onClick={toggleHost}/>}
                        {user && <NavbarItem title="Account" link='/accounts/profile' />}
                        {/*<NavbarItem title="Settings" link='/settings' />*/}
                        {user && <NavbarItem title="Sign Out" link='accounts/logout' />}
                        {!user && <NavbarItem title="Sign In" link='accounts/login' />}

                    </div>
                </div>}
            </div>
        </header>
    )
}

/*

Explore:        !host
Notifications:  user
Trips:          user && !host
Reservations:   user && host
Listings:       user && host

Account:        user
Sign In:        !user
Sign Out:       user


Item	        No Login	User	Host - User	Host - Host
Explore	        1	        1	    1	        0
Sign In	        1	        0	    0	        0
Sign Out	    0	        1	    1	        1
Notifications	0	        1	    1	        1
Trips	        0	        1	    1	        0
Reservations	0	        0	    0	        1
Listings	    0	        0	    0	        1
Account	        0	        1	    1	        1
*/