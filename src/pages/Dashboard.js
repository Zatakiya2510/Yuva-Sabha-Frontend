import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import api from "../services/api";

import {
    FaUsers,
    FaCalendarAlt,
    FaUserCheck,
    FaUserTimes,
    FaPlusCircle,
    FaClipboardList,
    FaChartLine,
    FaArrowRight
} from "react-icons/fa";

import "./Dashboard.css";

const Dashboard = () => {

    const navigate = useNavigate();

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({

        stats: {

            totalMembers: 0,

            totalEvents: 0,

            presentMembers: 0,

            absentMembers: 0

        },

        members: [],

        events: [],

        attendance: []

    });

    /*
    ====================================
    Dashboard API
    ====================================
    */

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [

                usersResponse,

                eventsResponse,

                attendanceResponse

            ] = await Promise.all([

                api.get("/users"),

                api.get("/events"),

                api.get("/attendance")

            ]);

            const members =
                usersResponse.data.data || [];

            const events =
                eventsResponse.data.data || [];

            const attendance =
                attendanceResponse.data.data || [];

            const presentMembers =
                attendance.filter(

                    item => item.status === "Present"

                ).length;

            const absentMembers =
                attendance.filter(

                    item => item.status === "Absent"

                ).length;

            setDashboard({

                stats: {

                    totalMembers:
                        usersResponse.data.totalUsers ||
                        members.length,

                    totalEvents:
                        eventsResponse.data.count ||
                        events.length,

                    presentMembers,

                    absentMembers

                },

                members,

                events,

                attendance

            });

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    /*
    ====================================
    Dashboard Cards
    ====================================
    */

    const cards = useMemo(() => [

        {

            title: "Total Members",

            value: dashboard.stats.totalMembers,

            icon: <FaUsers />,

            color: "blue",

            subtitle: "Registered Members"

        },

        {

            title: "Total Events",

            value: dashboard.stats.totalEvents,

            icon: <FaCalendarAlt />,

            color: "green",

            subtitle: "Sabha Events"

        },

        {

            title: "Present",

            value: dashboard.stats.presentMembers,

            icon: <FaUserCheck />,

            color: "cyan",

            subtitle: "Attendance"

        },

        {

            title: "Absent",

            value: dashboard.stats.absentMembers,

            icon: <FaUserTimes />,

            color: "red",

            subtitle: "Attendance"

        }

    ], [dashboard]);

    /*
    ====================================
    Recent Data
    ====================================
    */

    const recentEvents =
        dashboard.events.slice(0, 5);

    const recentMembers =
        dashboard.members.slice(0, 5);

    /*
    ====================================
    Attendance Percentage
    ====================================
    */

    const attendancePercentage =

        dashboard.stats.totalMembers === 0

            ? 0

            : Math.round(

                (dashboard.stats.presentMembers /

                    dashboard.stats.totalMembers) * 100

            );

    return (

        <Layout>

            {/* ===========================
                Welcome Section
            ============================ */}

            <div className="dashboard-header">

                <div>

                    <h2>

                        Welcome,

                        {" "}

                        {user.fullName || "Admin"}

                        👋

                    </h2>

                    <p>

                        Manage Members, Events and Attendance

                        from one place.

                    </p>

                </div>

            </div>

            {/* ===========================
                Statistics Cards
            ============================ */}

            <div className="dashboard-grid">

                {

                    cards.map(card => (

                        <div

                            className={`dashboard-card ${card.color}`}

                            key={card.title}

                        >

                            <div className="card-header">

                                <div>

                                    <h4>

                                        {card.title}

                                    </h4>

                                    <small>

                                        {card.subtitle}

                                    </small>

                                </div>

                                <div className="card-icon">

                                    {card.icon}

                                </div>

                            </div>

                            <h1>

                                {

                                    loading

                                        ?

                                        "..."

                                        :

                                        card.value

                                }

                            </h1>

                        </div>

                    ))

                }

            </div>

            {/* ===========================
                Quick Actions
            ============================ */}

            <div className="quick-actions">

                <h3>

                    Quick Actions

                </h3>

                <div className="action-grid">

                    <div

                        className="action-card"

                        onClick={() => navigate("/users")}

                    >

                        <FaPlusCircle />

                        <h4>

                            Add Member

                        </h4>

                        <p>

                            Register a new member

                        </p>

                    </div>

                    <div

                        className="action-card"

                        onClick={() => navigate("/events")}

                    >

                        <FaCalendarAlt />

                        <h4>

                            Create Event

                        </h4>

                        <p>

                            Schedule Yuva Sabha

                        </p>

                    </div>

                    <div

                        className="action-card"

                        onClick={() => navigate("/attendance")}

                    >

                        <FaClipboardList />

                        <h4>

                            Mark Attendance

                        </h4>

                        <p>

                            Present / Absent

                        </p>

                    </div>

                    <div

                        className="action-card"

                    >

                        <FaChartLine />

                        <h4>

                            Reports

                        </h4>

                        <p>

                            View Attendance Reports

                        </p>

                    </div>

                </div>

            </div>            {/* ===================================
                Dashboard Bottom
            ==================================== */}

            <div className="dashboard-bottom">

                {/* Recent Events */}

                <div className="dashboard-section">

                    <div className="section-header">

                        <h3>

                            Recent Events

                        </h3>

                        <button
                            type="button"
                            className="view-all-btn"
                            onClick={() => navigate("/events")}
                        >

                            <span>

                                View All

                            </span>

                            <FaArrowRight />

                        </button>

                    </div>

                    <table className="dashboard-table">

                        <thead>

                            <tr>

                                <th>Title</th>

                                <th>Date</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                recentEvents.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="3"
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >

                                            No Events Found

                                        </td>

                                    </tr>

                                    :

                                    recentEvents.map(event => (

                                        <tr key={event._id}>

                                            <td>

                                                {event.title}

                                            </td>

                                            <td>

                                                {

                                                    new Date(event.date)

                                                        .toLocaleDateString()

                                                }

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${event.status.toLowerCase()}`}
                                                >

                                                    {event.status}

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </table>

                </div>

                {/* Attendance Summary */}

                <div className="dashboard-section">

                    <div className="section-header">

                        <h3>Attendance Summary</h3>

                    </div>

                    <div className="attendance-summary">

                        <div className="summary-card">

                            <span>Total Members</span>

                            <h2>{dashboard.stats.totalMembers}</h2>

                        </div>

                        <div className="summary-card present">

                            <span>Present</span>

                            <h2>{dashboard.stats.presentMembers}</h2>

                        </div>

                        <div className="summary-card absent">

                            <span>Absent</span>

                            <h2>{dashboard.stats.absentMembers}</h2>

                        </div>

                    </div>

                    <div className="progress-wrapper">

                        <div className="progress-header">

                            <span>Attendance Percentage</span>

                            <strong>{attendancePercentage}%</strong>

                        </div>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                style={{
                                    width: `${attendancePercentage}%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* ===================================
                Recent Members
            ==================================== */}

            <div
                className="dashboard-section"
                style={{
                    marginTop: "30px"
                }}
            >

                <div className="section-header">

                    <h3>

                        Recent Members

                    </h3>

                    <button
                        type="button"
                        className="view-all-btn"
                        onClick={() => navigate("/users")}
                    >
                        <span>View All</span>
                        <FaArrowRight className="arrow-icon" />
                    </button>

                </div>

                <table className="dashboard-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Contact</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            recentMembers.length === 0 ?

                                <tr>

                                    <td
                                        colSpan="3"
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        No Members Found

                                    </td>

                                </tr>

                                :

                                recentMembers.map(member => (

                                    <tr key={member._id}>

                                        <td>

                                            {member.fullName}

                                        </td>

                                        <td>

                                            {member.contactNumber}

                                        </td>

                                        <td>

                                            <span

                                                className={
                                                    member.status === "Active"

                                                        ?

                                                        "badge completed"

                                                        :

                                                        "badge cancelled"

                                                }

                                            >

                                                {member.status}

                                            </span>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

            </div>

        </Layout>

    );

};

export default Dashboard;