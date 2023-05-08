import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AuthContext from './contexts/AuthProvider'
import { useAuth } from './hooks/useAuth';

import Layout  from './routes/Layout';
import Dashboard from './routes/Dashboard';

import Login from './routes/Login_Register/Login'
import Logout from './routes/Login_Register/Logout'
import Register from './routes/Login_Register/Register'

import Profile from './routes/Profile/Profile';
import ErrorPage from './routes/ErrorPage';
import Navbar from './routes/Navigation/Navbar';
import Tabbar from './routes/Navigation/Tabbar';
import { PropertyDetails } from './routes/Property/PropertyDetails';
import { PropertyEdit } from './routes/Property/Edit/PropertyEdit';
import ScrollToTop from "./services/ScrollToTop";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: '/',
//         element: <Dashboard/>,
//         children: [
//           {
//             path: ":propertyid",
//             element: <PropertyDetails />,
//           }
//         ]
//       },
      
//     ]
//   },
  
  
// ]);

function App() {
  // {/* <RouterProvider router={router} /> */}
  const {user, logout, getUser} = useAuth();
  const [hostMode, setHostMode] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  useEffect(() => {
      if (user) {
          // determine if new notification indicator should be visible
          // query unread notifications for user
          // setUnreadNotifications(true);
      } else {
          // setUnreadNotifications(false);
      }
  }, [user])

  return (
      <BrowserRouter>
          <ScrollToTop />
        <AuthContext.Provider value={{ user }}>
            <Routes>
              <Route path='/' element={<Layout unreadNotifications={unreadNotifications}/>}>
                <Route index element={<Dashboard/>}/>
                <Route path='properties/:propertyid' element={<PropertyDetails/>}/>
                <Route path='accounts/logout' element={<Logout/>}/>
                <Route path='accounts/login' element={<Login/>}/>
                <Route path='accounts/register' element={<Register/>}/>
                <Route path='properties/:propertyid/edit' element={<PropertyEdit/>}/>
                <Route path='accounts/profile' element={<Profile/>}/>
              </Route>
            </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
  );
}

export default App;
