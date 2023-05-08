import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import './style.css';

const titlemapping = {
    "Sign In": "account",
    "Account": "account",
    "Explore": "explore",
    "Trips": "reservations",
    "Reservations": "reservations",
    "Listings": "listings",
    "Notifications": "notifications",
}

const tabmapping = {
    explore: {
        link: '/',
        icon: 'fa-magnifying-glass'
    },
    account: {
        link: '/accounts/profile',
        icon: 'fa-circle-user'
    },
    notifications: {
        link: '/notifications',
        icon: 'fa-message'
    },
    listings: {
        link: '/listings',
        icon: 'fa-house-building'
    },
    reservations: {
        link: '/reservations',
        icon: 'fa-square-list'
    }
}

export default function TabbarItem({title, unreadNotifications=false}) {
    const location = useLocation();

    const {link, icon} = tabmapping[titlemapping[title]];

    return (
        <>
            <NavLink as={'a'} to={link} id={"tab-"+titlemapping[title]} className={"nav tab-item"+(location.pathname===link ? " active" : "")}>
                {unreadNotifications && <span className="new-notifications-count"></span>}
                <i className={`fa-regular ${icon} fa-2x`}></i>
                <span className="tab-label">{title}</span>
            </NavLink>
        </>
    )
}