import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Events from "../pages/Events";
import Attendance from "../pages/Attendance";
import Reports from "../pages/Reports";
import MemberForm from "../pages/MemberForm";
import EventForm from "../pages/EventForm";

const PrivateRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    return token
        ? children
        : <Navigate to="/login" replace />;

};

const AppRoutes = () => {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>

                        <Dashboard />

                    </PrivateRoute>
                }
            />

            <Route
                path="/users"
                element={
                    <PrivateRoute>

                        <Users />

                    </PrivateRoute>
                }
            />

            <Route
                path="/events"
                element={
                    <PrivateRoute>

                        <Events />

                    </PrivateRoute>
                }
            />

            <Route
                path="/attendance"
                element={
                    <PrivateRoute>

                        <Attendance />

                    </PrivateRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <PrivateRoute>

                        <Reports />

                    </PrivateRoute>
                }
            />
            <Route
                path="/users/add"
                element={
                    <PrivateRoute>
                        <MemberForm />
                    </PrivateRoute>
                }
            />

            <Route
                path="/users/edit/:id"
                element={
                    <PrivateRoute>
                        <MemberForm />
                    </PrivateRoute>
                }
            />

            <Route
                path="/events/add"
                element={
                    <PrivateRoute>
                        <EventForm />
                    </PrivateRoute>
                }
            />

            <Route
                path="/events/edit/:id"
                element={
                    <PrivateRoute>
                        <EventForm />
                    </PrivateRoute>
                }
            />

        </Routes>

    );

};

export default AppRoutes;