import { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";

import Layout from "../components/layout/Layout";

import api from "../services/api";

import "./EventForm.css";

const EventForm = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);

    /*
    =====================================
    States
    =====================================
    */

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({

        title: "",

        date: "",

        location: "",

        description: "",

        status: "Upcoming",

    });

    /*
    =====================================
    Handle Input Change
    =====================================
    */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    /*
    =====================================
    Fetch Event Details
    =====================================
    */

    const fetchEvent = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await api.get(`/events/${id}`);

            const event = data.data;

            setFormData({
                title: event.title || "",
                date: event.date
                    ? event.date.substring(0, 10)
                    : "",
                location: event.location || "",
                description: event.description || "",
                status: event.status || "Upcoming",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load event."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    /*
    =====================================
    Load Event
    =====================================
    */

    useEffect(() => {
        if (isEdit) {
            fetchEvent();
        }
    }, [isEdit, fetchEvent]);

    /*
    =====================================
    Save / Update Event
    =====================================
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.title.trim()) {

            return toast.error("Event title is required.");

        }

        if (!formData.date) {

            return toast.error("Event date is required.");

        }

        try {

            setSaving(true);

            if (isEdit) {

                await api.put(

                    `/events/${id}`,

                    formData

                );

                toast.success(

                    "Event updated successfully."

                );

            }

            else {

                await api.post(

                    "/events",

                    formData

                );

                toast.success(

                    "Event created successfully."

                );

            }

            setTimeout(() => {

                navigate("/events");

            }, 1000);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to save event."

            );

        }

        finally {

            setSaving(false);

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

            <div className="event-form-page">

                <div className="event-form-header">

                    <div>

                        <h2>

                            {

                                isEdit

                                    ?

                                    "Edit Event"

                                    :

                                    "Create Event"

                            }

                        </h2>

                        <p>

                            {

                                isEdit

                                    ?

                                    "Update event information."

                                    :

                                    "Create a new Sabha event."

                            }

                        </p>

                    </div>

                </div>

                {

                    loading

                        ?

                        <div className="loading-box">

                            Loading Event...

                        </div>

                        :

                        <form

                            className="event-form"

                            onSubmit={handleSubmit}

                        >                        <div className="form-grid">

                                {/* ===========================
                                Event Title
                            =========================== */}

                                <div className="form-group">

                                    <label>

                                        Event Title

                                    </label>

                                    <input

                                        type="text"

                                        name="title"

                                        placeholder="Enter Event Title"

                                        value={formData.title}

                                        onChange={handleChange}

                                    />

                                </div>

                                {/* ===========================
                                Event Date
                            =========================== */}

                                <div className="form-group">

                                    <label>

                                        Event Date

                                    </label>

                                    <input

                                        type="date"

                                        name="date"

                                        value={formData.date}

                                        onChange={handleChange}

                                    />

                                </div>

                                {/* ===========================
                                Location
                            =========================== */}

                                <div className="form-group">

                                    <label>

                                        Location

                                    </label>

                                    <input

                                        type="text"

                                        name="location"

                                        placeholder="Enter Event Location"

                                        value={formData.location}

                                        onChange={handleChange}

                                    />

                                </div>

                                {/* ===========================
                                Status
                            =========================== */}

                                <div className="form-group">

                                    <label>

                                        Status

                                    </label>

                                    <select

                                        name="status"

                                        value={formData.status}

                                        onChange={handleChange}

                                    >

                                        <option value="Upcoming">

                                            Upcoming

                                        </option>

                                        <option value="Completed">

                                            Completed

                                        </option>

                                        <option value="Cancelled">

                                            Cancelled

                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* ===========================
                            Description
                        =========================== */}

                            <div className="form-group full-width">

                                <label>

                                    Description

                                </label>

                                <textarea

                                    name="description"

                                    rows="5"

                                    placeholder="Write Event Description..."

                                    value={formData.description}

                                    onChange={handleChange}

                                />

                            </div>

                            {/* ===========================
                            Buttons
                        =========================== */}

                            <div className="form-actions">

                                <button

                                    type="button"

                                    className="cancel-btn"

                                    onClick={() =>

                                        navigate("/events")

                                    }

                                >

                                    Cancel

                                </button>

                                <button

                                    type="submit"

                                    className="save-btn"

                                    disabled={saving}

                                >

                                    {

                                        saving

                                            ?

                                            (

                                                isEdit

                                                    ?

                                                    "Updating..."

                                                    :

                                                    "Saving..."

                                            )

                                            :

                                            (

                                                isEdit

                                                    ?

                                                    "Update Event"

                                                    :

                                                    "Create Event"

                                            )

                                    }

                                </button>

                            </div>

                        </form>

                }

            </div>

        </Layout>

    );

};

export default EventForm;