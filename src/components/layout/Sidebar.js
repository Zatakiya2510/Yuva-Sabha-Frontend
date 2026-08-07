import { NavLink, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaCalendarAlt,
    FaClipboardCheck,
    FaChartBar,
    FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.clear();

        navigate("/login");

    };

    return (

        <div className="sidebar">

            <div className="logo">

                Attendance

            </div>

            <nav>

                <NavLink to="/dashboard">
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink to="/users">
                    <FaUsers />
                    Members
                </NavLink>

                <NavLink to="/events">
                    <FaCalendarAlt />
                    Events
                </NavLink>

                <NavLink to="/attendance">
                    <FaClipboardCheck />
                    Attendance
                </NavLink>

                <NavLink to="/reports">
                    <FaChartBar />
                    Reports
                </NavLink>

            </nav>

            <button
                className="logout-btn"
                onClick={logout}
            >
                <FaSignOutAlt />

                Logout
            </button>

        </div>

    );

};

export default Sidebar;