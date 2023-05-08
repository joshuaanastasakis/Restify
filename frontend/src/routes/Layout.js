import { Outlet } from 'react-router-dom';
import Navbar from './Navigation/Navbar';
import Tabbar from './Navigation/Tabbar';

export default function Layout({unreadNotifications}) {
    
    return (
        <>
            <Navbar unreadNotifications={unreadNotifications} />
            <main>
                <Outlet />
            </main>
            <Tabbar unreadNotifications={unreadNotifications} />
        </>
    );
}