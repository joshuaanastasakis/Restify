import NavbarItem from './TabbarItem'
import './style.css'
import TabbarItem from "./TabbarItem";
import { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from 'react-router-dom'

const tabs = {
    Explore: "Explore",
    Account: "Account",
    Login: "Sign In",
    Listings: "Listings",
    Reservations: "Reservations",
    Trips: "Trips",
    Notifications: "Notifications",
}

export default function Tabbar({unreadNotifications}) {
    const [user, setUser] = useState(null)
    const [hostMode, setHostMode] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const userJSON = JSON.parse(localStorage.getItem("user"));
        setUser(userJSON)
        const hostModeJSON = localStorage.getItem("hostMode");
        setHostMode(hostModeJSON)
    }, []);

    return (
        <footer>
            <TabbarItem title={tabs.Explore} />
            {user && hostMode && <TabbarItem title={tabs.Listings} />}
            {user && hostMode && <TabbarItem title={tabs.Reservations} />}
            {user && !hostMode && <TabbarItem title={tabs.Trips} />}
            {user && <TabbarItem title={tabs.Notifications} unreadNotifications={unreadNotifications} />}
            {!user && <TabbarItem title={tabs.Login}/>}
            {user && <TabbarItem title={tabs.Account} />}

        </footer>
    )
}