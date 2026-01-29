import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import Trainers from '@/pages/Trainers';
import Classes from '@/pages/Classes';
import Forum from '@/pages/Forum';
import TrainerDetail from '@/pages/TrainerDetail';
import Booking from '@/pages/Booking';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BeATrainer from '@/pages/BeATrainer';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PostDetail from '@/pages/PostDetail';
import AddForum from '@/pages/AddForum';
import ManageForums from '@/pages/ManageForums';
import EditForum from '@/pages/EditForum';
import Payment from '@/pages/Payment';

// Dashboard Components
import MemberDashboard from '@/pages/MemberDashboard';
import MemberBookings from '@/pages/member/MemberBookings';
import Profile from '@/pages/member/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import ManageApplications from '@/pages/admin/ManageApplications';
import ApplicationDetails from '@/pages/admin/ApplicationDetails';
import AdminNewsletter from '@/pages/AdminNewsletter';
import AddClass from '@/pages/admin/AddClass';
import EditClass from '@/pages/admin/EditClass';
import AllClasses from '@/pages/admin/AllClasses';
import AllTrainers from '@/pages/admin/AllTrainers';
import ActivityLog from '@/pages/member/ActivityLog';
import ManageSlots from '@/pages/trainer/ManageSlots';
import AddSlot from '@/pages/trainer/AddSlot';
import EditSlot from '@/pages/trainer/EditSlot';
import MyStudents from '@/pages/trainer/MyStudents';

// Stubs for remaining pages
import TrainerOverview from '@/pages/trainer/TrainerOverview';

const Settings = () => <div className="container py-24"><h1>Settings Page</h1></div>;

import ErrorPage from '@/pages/ErrorPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/trainers', element: <Trainers /> },
            { path: '/trainers/:id', element: <TrainerDetail /> },
            { path: '/classes', element: <Classes /> },
            { path: '/forum', element: <Forum /> },
            { path: '/forum/:id', element: <PostDetail /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            {
                path: '/become-trainer',
                element: (
                    <ProtectedRoute allowedRoles={['member']}>
                        <BeATrainer />
                    </ProtectedRoute>
                )
            },
            { path: '/booking/:trainerId/:slotId', element: <Booking /> },
            { path: '/payment/:trainerId/:slotId/:packageId', element: <Payment /> },
            { path: '/settings', element: <Settings /> },

            // Dashboard Routes
            { path: '/dashboard', element: <MemberDashboard /> },
            { path: '/dashboard/bookings', element: <MemberBookings /> },
            { path: '/dashboard/profile', element: <Profile /> },
            { path: '/dashboard/add-forum', element: <ProtectedRoute allowedRoles={['admin', 'trainer']}><AddForum /></ProtectedRoute> },
            { path: '/dashboard/manage-forums', element: <ProtectedRoute allowedRoles={['admin', 'trainer']}><ManageForums /></ProtectedRoute> },
            { path: '/dashboard/edit-forum/:id', element: <ProtectedRoute allowedRoles={['admin', 'trainer']}><EditForum /></ProtectedRoute> },
            {
                path: '/dashboard/activity-log',
                element: (
                    <ProtectedRoute allowedRoles={['member']}>
                        <ActivityLog />
                    </ProtectedRoute>
                )
            },

            { path: '/admin-dashboard', element: <AdminDashboard /> },
            { path: '/admin-dashboard/trainers', element: <AllTrainers /> },
            { path: '/admin-dashboard/applications', element: <ManageApplications /> },
            { path: '/admin-dashboard/applications/:id', element: <ApplicationDetails /> },
            { path: '/admin-dashboard/newsletter', element: <AdminNewsletter /> },
            { path: '/admin-dashboard/classes', element: <AllClasses /> },
            { path: '/admin-dashboard/add-class', element: <AddClass /> },
            { path: '/admin-dashboard/classes/edit/:id', element: <EditClass /> },
            { path: '/trainer-dashboard', element: <TrainerOverview /> },
            { path: '/trainer-dashboard/slots', element: <ManageSlots /> },
            { path: '/trainer-dashboard/add-slot', element: <AddSlot /> },
            { path: '/trainer-dashboard/edit-slot/:id', element: <EditSlot /> },
            {
                path: '/trainer-dashboard/students', element: (
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MyStudents />
                    </ProtectedRoute>
                )
            },

            // Catch-all 404
            { path: '*', element: <ErrorPage /> }
        ],
    },
]);


const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
