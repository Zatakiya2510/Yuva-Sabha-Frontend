import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";

import api from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Toaster, toast } from "react-hot-toast";

import {
    FaSearch,
    FaUsers,
    FaUserCheck,
    FaUserTimes,
    FaChartPie
} from "react-icons/fa";

import "./Reports.css";

const Reports = () => {

    /*
    =====================================
    States
    =====================================
    */

    const [loading, setLoading] = useState(true);

    const [events, setEvents] = useState([]);

    const [attendance, setAttendance] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

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
    Load Attendance Report
    =====================================
    */

    const fetchReport = async (eventId) => {

        if (!eventId) {

            setAttendance([]);

            return;

        }

        try {

            setLoading(true);

            const { data } = await api.get(

                `/attendance/event/${eventId}`

            );

            setAttendance(data.data || []);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to load report."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /*
    =====================================
    Initial Load
    =====================================
    */

    useEffect(() => {

        fetchEvents();

        setLoading(false);

    }, []);

    /*
    =====================================
    Event Change
    =====================================
    */

    const handleEventChange = async (e) => {

        const eventId = e.target.value;

        setSelectedEvent(eventId);

        await fetchReport(eventId);

    };

    /*
    =====================================
    Filter Report
    =====================================
    */

    const filteredReport = useMemo(() => {

        return attendance.filter((item) => {

            const searchMatch =

                item.user.fullName

                    .toLowerCase()

                    .includes(search.toLowerCase())

                ||

                item.user.contactNumber.includes(search);

            const statusMatch =

                statusFilter === "All"

                ||

                item.status === statusFilter;

            return searchMatch && statusMatch;

        });

    }, [

        attendance,

        search,

        statusFilter

    ]);

    /*
    =====================================
    Statistics
    =====================================
    */

    const totalMembers = filteredReport.length;

    const presentMembers = filteredReport.filter(

        item => item.status === "Present"

    ).length;

    const absentMembers = filteredReport.filter(

        item => item.status === "Absent"

    ).length;

    const attendancePercentage =

        totalMembers === 0

            ? 0

            : Math.round(

                (presentMembers / totalMembers) * 100

            );

    /*
=====================================
Export Excel
=====================================
*/

    const exportExcel = () => {

        if (!filteredReport.length) {

            return toast.error("No report available.");

        }

        const excelData = filteredReport.map((item, index) => ({

            "Sr No": index + 1,

            "Member": item.user.fullName,

            "Contact": item.user.contactNumber,

            "Status": item.status

        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Attendance Report"

        );

        const excelBuffer = XLSX.write(

            workbook,

            {

                type: "array",

                bookType: "xlsx"

            }

        );

        const blob = new Blob(

            [excelBuffer],

            {

                type:

                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

            }

        );

        saveAs(

            blob,

            "Attendance_Report.xlsx"

        );

    };

    /*
    =====================================
    Export PDF
    =====================================
    */

    const exportPDF = () => {

        if (!filteredReport.length) {

            return toast.error("No report available.");

        }

        const doc = new jsPDF();

        doc.setFontSize(18);

        doc.text(

            "Attendance Report",

            14,

            20

        );

        autoTable(doc, {

            startY: 30,

            head: [

                [

                    "Sr",

                    "Member",

                    "Contact",

                    "Status"

                ]

            ],

            body: filteredReport.map(

                (item, index) => [

                    index + 1,

                    item.user.fullName,

                    item.user.contactNumber,

                    item.status

                ]

            )

        });

        doc.save(

            "Attendance_Report.pdf"

        );

    };

    /*
    =====================================
    Print
    =====================================
    */

    const printReport = () => {

        window.print();

    };

    /*
    =====================================
    JSX
    =====================================
    */

    return (

        <Layout>

            <Toaster position="top-right" />

            <div className="reports-header">

                <div>

                    <h2>

                        Attendance Reports

                    </h2>

                    <p>

                        View attendance report by event

                    </p>

                </div>

            </div>{/* =====================================
Filters
===================================== */}

            <div className="report-filters">

                <div className="filter-group">

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

                                        new Date(

                                            event.date

                                        ).toLocaleDateString()

                                    }

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="filter-group">

                    <label>

                        Search Member

                    </label>

                    <div className="search-box">

                        <FaSearch className="search-icon" />

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

                <div className="filter-group">

                    <label>

                        Status

                    </label>

                    <select

                        value={statusFilter}

                        onChange={(e) =>

                            setStatusFilter(e.target.value)

                        }

                    >

                        <option value="All">

                            All

                        </option>

                        <option value="Present">

                            Present

                        </option>

                        <option value="Absent">

                            Absent

                        </option>

                    </select>

                </div>

            </div>

            {/* =====================================
Summary Cards
===================================== */}

            <div className="report-summary">

                <div className="summary-card">

                    <FaUsers />

                    <div>

                        <h5>Total Members</h5>

                        <h2>{totalMembers}</h2>

                    </div>

                </div>

                <div className="summary-card present">

                    <FaUserCheck />

                    <div>

                        <h5>Present</h5>

                        <h2>{presentMembers}</h2>

                    </div>

                </div>

                <div className="summary-card absent">

                    <FaUserTimes />

                    <div>

                        <h5>Absent</h5>

                        <h2>{absentMembers}</h2>

                    </div>

                </div>

                <div className="summary-card percentage">

                    <FaChartPie />

                    <div>

                        <h5>Attendance %</h5>

                        <h2>

                            {attendancePercentage}%

                        </h2>

                    </div>

                </div>

            </div>

            {/* =====================================
Report Table
===================================== */}

            <div className="report-table-container">

                <table className="report-table">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Member</th>

                            <th>Contact</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                (

                                    <tr>

                                        <td

                                            colSpan="4"

                                            className="loading"

                                        >

                                            Loading Report...

                                        </td>

                                    </tr>

                                )

                                :

                                filteredReport.length === 0 ?

                                    (

                                        <tr>

                                            <td

                                                colSpan="4"

                                                className="loading"

                                            >

                                                No Attendance Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    filteredReport.map(

                                        (item, index) => (

                                            <tr

                                                key={item._id}

                                            >

                                                <td>

                                                    {index + 1}

                                                </td>

                                                <td>

                                                    {item.user.fullName}

                                                </td>

                                                <td>

                                                    {

                                                        item.user

                                                            .contactNumber

                                                    }

                                                </td>

                                                <td>

                                                    <span

                                                        className={`status-badge ${item.status.toLowerCase()}`}

                                                    >

                                                        {item.status}

                                                    </span>

                                                </td>

                                            </tr>

                                        )

                                    )

                        }

                    </tbody>

                </table>

            </div>

            {/* =====================================
Export Buttons
===================================== */}

            <div className="report-actions">

                <button

                    className="excel-btn"

                    onClick={exportExcel}

                >

                    Export Excel

                </button>

                <button

                    className="pdf-btn"

                    onClick={exportPDF}

                >

                    Export PDF

                </button>

                <button

                    className="print-btn"

                    onClick={printReport}

                >

                    Print Report

                </button>

            </div>
        </Layout>

    );

};

export default Reports;