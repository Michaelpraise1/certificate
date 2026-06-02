import { createBrowserRouter, redirect } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

import DashboardOverview from './pages/dashboard/DashboardOverview';
import CreateCertificationPage from './pages/dashboard/CreateCertification';

import { guestOnly, requireAuth } from "./utils/middlewares";


export const router = createBrowserRouter([
    {
        path: "/",
        loader: async () => redirect('/login')
    },
    {
        element: <AuthLayout />,
        loader: guestOnly,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/signup",
                element: <SignupPage />,
            },
        ],
    },
    {
        element: <DashboardLayout />,
        loader: requireAuth,
        children: [
            {
                path: "/dashboard",
                element: <DashboardOverview />
            },
            {
                path: "/create-certification",
                element: <CreateCertificationPage />
            }
        ]

    }
]);