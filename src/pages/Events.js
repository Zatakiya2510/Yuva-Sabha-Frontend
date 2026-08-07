import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";

import Layout from "../components/layout/Layout";

import api from "../services/api";

import Swal from "sweetalert2";

import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaCalendarAlt,
    FaMapMarkerAlt
} from "react-icons/fa";

import "./Events.css";

const Events = () => {

    const navigate = useNavigate();

    /*
    =====================================
    States
    =====================================
    */

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const eventsPerPage = 10;

    /*
    =====================================
    Fetch Events
    =====================================
    */

    const fetchEvents = async () => {

        try {

            setLoading(true);

            const { data } = await api.get("/events");

            setEvents(data.data || []);

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to fetch events."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /*
    =====================================
    Load Events
    =====================================
    */

    useEffect(() => {

        fetchEvents();

    }, []);

    /*
    =====================================
    Search Events
    =====================================
    */

    const filteredEvents = useMemo(() => {

        return events.filter((event) =>

            event.title

                .toLowerCase()

                .includes(search.toLowerCase())

            ||

            event.location

                ?.toLowerCase()

                .includes(search.toLowerCase())

        );

    }, [events, search]);

    /*
    =====================================
    Pagination
    =====================================
    */

    const indexOfLastEvent =

        currentPage * eventsPerPage;

    const indexOfFirstEvent =

        indexOfLastEvent - eventsPerPage;

    const currentEvents =

        filteredEvents.slice(

            indexOfFirstEvent,

            indexOfLastEvent

        );

    const totalPages =

        Math.ceil(

            filteredEvents.length /

            eventsPerPage

        );

    /*
    =====================================
    Delete Event
    =====================================
    */

    const deleteEvent = async (id) => {

        const result = await Swal.fire({

            title: "Delete Event?",

            text: "This event and its attendance records will be removed.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel",

            reverseButtons: true,

        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/events/${id}`);

            Swal.fire({

                icon: "success",

                title: "Deleted!",

                text: "Event deleted successfully.",

                timer: 1500,

                showConfirmButton: false,

            });

            fetchEvents();

        }

        catch (error) {

            Swal.fire({

                icon: "error",

                title: "Error",

                text:

                    error.response?.data?.message ||

                    "Unable to delete event.",

            });

        }

    };

    /*
    =====================================
    JSX
    =====================================
    */

    return (

        <Layout>

            <Toaster position="top-right" />

            <div className="events-header">

                <div>

                    <h2>

                        Events

                    </h2>

                    <p>

                        Manage Sabha Events

                    </p>

                </div>

                <button

                    className="add-btn"

                    onClick={() =>

                        navigate("/events/add")

                    }

                >

                    <FaPlus />

                    <span>

                        Create Event

                    </span>

                </button>

            </div>

            <div className="search-container">

                <FaSearch className="search-icon" />

                <input

                    type="text"

                    placeholder="Search Event"

                    value={search}

                    onChange={(e) => {

                        setSearch(

                            e.target.value

                        );

                        setCurrentPage(1);

                    }}

                />

            </div>

            <div className="table-container">

                <table className="events-table">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Event</th>

                            <th>Date</th>

                            <th>Location</th>

                            <th>Status</th>

                            <th width="140">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ?

                            (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="loading"
                                    >

                                        Loading Events...

                                    </td>

                                </tr>

                            )

                            :

                            currentEvents.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="loading"
                                        >

                                            No Events Found

                                        </td>

                                    </tr>

                                )

                                :

                                currentEvents.map((event, index) => (

                                    <tr key={event._id}>

                                        <td>

                                            {indexOfFirstEvent + index + 1}

                                        </td>

                                        <td>

                                            <div className="event-name">

                                                <FaCalendarAlt />

                                                <div>

                                                    <strong>

                                                        {event.title}

                                                    </strong>

                                                    {

                                                        event.description &&

                                                        <small>

                                                            {event.description}

                                                        </small>

                                                    }

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    event.date

                                                ).toLocaleDateString(

                                                    "en-IN",

                                                    {

                                                        day: "2-digit",

                                                        month: "short",

                                                        year: "numeric"

                                                    }

                                                )

                                            }

                                        </td>

                                        <td>

                                            <div className="event-location">

                                                <FaMapMarkerAlt />

                                                <span>

                                                    {

                                                        event.location ||

                                                        "-"

                                                    }

                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <span

                                                className={`event-status ${event.status.toLowerCase()}`}

                                            >

                                                {event.status}

                                            </span>

                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button

                                                    className="edit-btn"

                                                    title="Edit"

                                                    onClick={() =>

                                                        navigate(

                                                            `/events/edit/${event._id}`

                                                        )

                                                    }

                                                >

                                                    <FaEdit />

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    title="Delete"

                                                    onClick={() =>

                                                        deleteEvent(event._id)

                                                    }

                                                >

                                                    <FaTrash />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

            </div>

            {

                totalPages > 1 && (

                    <div className="pagination">

                        <button

                            disabled={currentPage === 1}

                            onClick={() =>

                                setCurrentPage(

                                    currentPage - 1

                                )

                            }

                        >

                            Previous

                        </button>

                        <span>

                            Page

                            {" "}

                            {currentPage}

                            {" "}

                            of

                            {" "}

                            {totalPages}

                        </span>

                        <button

                            disabled={

                                currentPage === totalPages

                            }

                            onClick={() =>

                                setCurrentPage(

                                    currentPage + 1

                                )

                            }

                        >

                            Next

                        </button>

                    </div>

                )

            }

        </Layout>

    );

};

export default Events;