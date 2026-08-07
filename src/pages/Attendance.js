import { useEffect, useMemo, useState } from "react";

import { Toaster, toast } from "react-hot-toast";

import Layout from "../components/layout/Layout";

import api from "../services/api";

import "./Attendance.css";
import Swal from "sweetalert2";

const Attendance = () => {

    /*
    =====================================
    States
    =====================================
    */

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [events, setEvents] = useState([]);

    const [members, setMembers] = useState([]);

    const [attendance, setAttendance] = useState({});

    const [selectedEvent, setSelectedEvent] = useState("");

    const [search, setSearch] = useState("");

    /*
    =====================================
    Load Events
    =====================================
    */

    const fetchEvents = async () => {

        try {

            const { data } = await api.get("/events");

            setEvents(data.data || []);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to load events."

            );

        }

    };

    /*
    =====================================
    Load Members
    =====================================
    */

    const fetchMembers = async () => {

        try {

            const { data } = await api.get("/users?limit=500");

            setMembers(data.data || []);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to load members."

            );

        }

    };

    /*
    =====================================
    Initial Load
    =====================================
    */

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([

                fetchEvents(),

                fetchMembers()

            ]);

            setLoading(false);

        };

        loadData();

    }, []);    /*
    =====================================
    Load Attendance By Event
    =====================================
    */

    const fetchAttendance = async (eventId) => {

        if (!eventId) {

            setAttendance({});

            return;

        }

        try {

            const { data } = await api.get(

                `/attendance/event/${eventId}`

            );

            const attendanceMap = {};

            data.data.forEach((item) => {

                attendanceMap[item.user._id] = {

                    attendanceId: item._id,

                    status: item.status,

                };

            });

            setAttendance(attendanceMap);

        }

        catch (error) {

            console.log(error);

            setAttendance({});

        }

    };

    /*
    =====================================
    Event Change
    =====================================
    */

    const handleEventChange = async (e) => {

        const eventId = e.target.value;

        setSelectedEvent(eventId);

        await fetchAttendance(eventId);

    };

    /*
    =====================================
    Attendance Change
    =====================================
    */

    const handleAttendanceChange = (

        userId,

        status

    ) => {

        setAttendance((prev) => ({

            ...prev,

            [userId]: {

                ...prev[userId],

                status,

            },

        }));

    };

    /*
    =====================================
    Search Members
    =====================================
    */

    const filteredMembers = useMemo(() => {

        return members.filter((member) =>

            member.fullName

                .toLowerCase()

                .includes(search.toLowerCase())

            ||

            member.contactNumber

                .includes(search)

        );

    }, [members, search]);

    /*
    =====================================
    Statistics
    =====================================
    */

    const presentCount = Object.values(

        attendance

    ).filter(

        (item) => item.status === "Present"

    ).length;

    const absentCount = Object.values(

        attendance

    ).filter(

        (item) => item.status === "Absent"

    ).length;

    /*
    =====================================
    Mark All Present
    =====================================
    */

    const markAllPresent = () => {

        const updated = {};

        filteredMembers.forEach((member) => {

            updated[member._id] = {

                ...attendance[member._id],

                status: "Present",

            };

        });

        setAttendance(updated);

    };

    /*
    =====================================
    Mark All Absent
    =====================================
    */

    const markAllAbsent = () => {

        const updated = {};

        filteredMembers.forEach((member) => {

            updated[member._id] = {

                ...attendance[member._id],

                status: "Absent",

            };

        });

        setAttendance(updated);

    };

    /*
=====================================
Save Attendance
=====================================
*/

    const saveAttendance = async () => {

        if (!selectedEvent) {

            return toast.error("Please select an event.");

        }

        const result = await Swal.fire({

            title: "Save Attendance?",

            text: "Do you want to save attendance for this event?",

            icon: "question",

            showCancelButton: true,

            confirmButtonText: "Yes, Save",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#2563eb",

            cancelButtonColor: "#6b7280",

            reverseButtons: true,

        });

        if (!result.isConfirmed) {

            return;

        }

        try {

            setSaving(true);

            const attendancePromises = [];

            filteredMembers.forEach((member) => {

                const attendanceData = attendance[member._id];

                if (!attendanceData?.status) return;

                if (attendanceData.attendanceId) {

                    attendancePromises.push(

                        api.put(

                            `/attendance/${attendanceData.attendanceId}`,

                            {

                                status: attendanceData.status

                            }

                        )

                    );

                }

                else {

                    attendancePromises.push(

                        api.post(

                            "/attendance",

                            {

                                user: member._id,

                                event: selectedEvent,

                                status: attendanceData.status

                            }

                        )

                    );

                }

            });

            await Promise.all(attendancePromises);

            toast.success(

                "Attendance saved successfully."

            );

            fetchAttendance(selectedEvent);

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to save attendance."

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

            <div className="attendance-page">

                <div className="attendance-header">

                    <div>

                        <h2>

                            Attendance

                        </h2>

                        <p>

                            Mark attendance for Sabha events

                        </p>

                    </div>

                </div>{/* =====================================
Event Selection & Search
===================================== */}

                <div className="attendance-top">

                    <div className="event-select">

                        <label>

                            Select Event

                        </label>

                        <select

                            value={selectedEvent}

                            onChange={handleEventChange}

                        >

                            <option value="">

                                -- Select Event --

                            </option>

                            {

                                events.map((event) => (

                                    <option

                                        key={event._id}

                                        value={event._id}

                                    >

                                        {event.title}

                                        {" - "}

                                        {

                                            new Date(event.date)

                                                .toLocaleDateString()

                                        }

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="member-search">

                        <label>

                            Search Member

                        </label>

                        <input

                            type="text"

                            placeholder="Search by name or contact..."

                            value={search}

                            onChange={(e) =>

                                setSearch(e.target.value)

                            }

                        />

                    </div>

                </div>

                {/* =====================================
Summary Cards
===================================== */}

                <div className="attendance-summary">

                    <div className="summary-card">

                        <h4>

                            Total Members

                        </h4>

                        <h2>

                            {filteredMembers.length}

                        </h2>

                    </div>

                    <div className="summary-card present">

                        <h4>

                            Present

                        </h4>

                        <h2>

                            {presentCount}

                        </h2>

                    </div>

                    <div className="summary-card absent">

                        <h4>

                            Absent

                        </h4>

                        <h2>

                            {absentCount}

                        </h2>

                    </div>

                </div>

                {/* =====================================
Bulk Actions
===================================== */}

                <div className="attendance-actions">

                    <button

                        className="present-btn"

                        onClick={markAllPresent}

                        disabled={!selectedEvent}

                    >

                        Mark All Present

                    </button>

                    <button

                        className="absent-btn"

                        onClick={markAllAbsent}

                        disabled={!selectedEvent}

                    >

                        Mark All Absent

                    </button>

                </div>

                {/* =====================================
Attendance Table
===================================== */}

                <div className="attendance-table-container">

                    <table className="attendance-table">

                        <thead>

                            <tr>

                                <th width="60">

                                    #

                                </th>

                                <th>

                                    Member Name

                                </th>

                                <th>

                                    Contact

                                </th>

                                <th width="180">

                                    Attendance

                                </th>

                            </tr>

                        </thead>

                        <tbody>{
                            loading ? (

                                <tr>

                                    <td

                                        colSpan="4"

                                        className="loading"

                                    >

                                        Loading Members...

                                    </td>

                                </tr>

                            ) : filteredMembers.length === 0 ? (

                                <tr>

                                    <td

                                        colSpan="4"

                                        className="loading"

                                    >

                                        No Members Found

                                    </td>

                                </tr>

                            ) : (

                                filteredMembers.map((member, index) => (

                                    <tr key={member._id}>

                                        <td>

                                            {index + 1}

                                        </td>

                                        <td>

                                            <div className="member-info">

                                                <strong>

                                                    {member.fullName}

                                                </strong>

                                            </div>

                                        </td>

                                        <td>

                                            {member.contactNumber}

                                        </td>

                                        <td>

                                            <div className="attendance-radio">

                                                <label>

                                                    <input

                                                        type="radio"

                                                        name={`attendance-${member._id}`}

                                                        value="Present"

                                                        checked={

                                                            attendance[member._id]?.status ===

                                                            "Present"

                                                        }

                                                        onChange={() =>

                                                            handleAttendanceChange(

                                                                member._id,

                                                                "Present"

                                                            )

                                                        }

                                                        disabled={!selectedEvent}

                                                    />

                                                    Present

                                                </label>

                                                <label>

                                                    <input

                                                        type="radio"

                                                        name={`attendance-${member._id}`}

                                                        value="Absent"

                                                        checked={

                                                            attendance[member._id]?.status ===

                                                            "Absent"

                                                        }

                                                        onChange={() =>

                                                            handleAttendanceChange(

                                                                member._id,

                                                                "Absent"

                                                            )

                                                        }

                                                        disabled={!selectedEvent}

                                                    />

                                                    Absent

                                                </label>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                        </tbody>

                    </table>

                </div>

                {/* =====================================
Save Attendance
===================================== */}

                <div className="save-section">

                    <button

                        className="save-attendance-btn"

                        disabled={

                            saving ||

                            !selectedEvent

                        }

                        onClick={saveAttendance}

                    >

                        {

                            saving

                                ?

                                "Saving..."

                                :

                                "Save Attendance"

                        }

                    </button>

                </div>

            </div>

        </Layout>

    );

};

export default Attendance;