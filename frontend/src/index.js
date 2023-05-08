import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./contexts/AuthProvider";
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ScrollToTop from "./services/ScrollToTop";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Dashboard />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/property/:propertyid",
//     element: <PropertyDetails />,
//     loader: propertyLoader,
//   }
  
// ]);

// <Navbar />
// <RouterProvider router={router} />
// <Tabbar />

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
