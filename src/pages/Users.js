import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";

import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import "./Users.css";

const Users = () => {

    /*
    ======================================
    States
    ======================================
    */
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 10;

    /*
    ======================================
    Fetch Users
    ======================================
    */

    const fetchUsers = async () => {

        try {

            setLoading(true);

            const { data } = await api.get("/users");

            setUsers(data.data || []);

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to fetch members."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /*
    ======================================
    Delete User
    ======================================
    */

    const deleteUser = async (id) => {

        const result = await Swal.fire({

            title: "Delete Member?",

            text: "This member will be permanently deleted.",

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

            await api.delete(`/users/${id}`);

            Swal.fire({

                icon: "success",

                title: "Deleted!",

                text: "Member deleted successfully.",

                timer: 1500,

                showConfirmButton: false,

            });

            fetchUsers();

        }

        catch (error) {

            Swal.fire({

                icon: "error",

                title: "Error",

                text:

                    error.response?.data?.message ||

                    "Unable to delete member.",

            });

        }

    };

    /*
    ======================================
    Load Users
    ======================================
    */

    useEffect(() => {

        fetchUsers();

    }, []);


    /*
    ======================================
    Search
    ======================================
    */

    const filteredUsers = useMemo(() => {

        return users.filter((user) =>

            user.fullName

                .toLowerCase()

                .includes(search.toLowerCase())

            ||

            user.contactNumber.includes(search)

        );

    }, [users, search]);

    /*
    ======================================
    Pagination
    ======================================
    */

    const indexOfLastUser =

        currentPage * usersPerPage;

    const indexOfFirstUser =

        indexOfLastUser - usersPerPage;

    const currentUsers =

        filteredUsers.slice(

            indexOfFirstUser,

            indexOfLastUser

        );

    const totalPages =

        Math.ceil(

            filteredUsers.length / usersPerPage

        );

    /*
    ======================================
    JSX
    ======================================
    */

    return (

        <Layout>

            <Toaster position="top-right" />

            <div className="users-header">

                <div>

                    <h2>

                        Members

                    </h2>

                    <p>

                        Manage all registered members

                    </p>

                </div>

                <button

                    className="add-btn"

                    onClick={() => navigate("/users/add")}

                >

                    <FaPlus />

                    <span>Add Member</span>

                </button>

            </div>

            <div className="search-container">

                <FaSearch className="search-icon" />

                <input

                    type="text"

                    placeholder="Search by Name or Contact Number"

                    value={search}

                    onChange={(e) => {

                        setSearch(e.target.value);

                        setCurrentPage(1);

                    }}

                />

            </div>

            <div className="table-container">

                <table className="users-table">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Name</th>

                            <th>Contact</th>

                            <th>Role</th>

                            <th>Status</th>

                            <th width="140">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                (

                                    <tr>

                                        <td

                                            colSpan="6"

                                            className="loading"

                                        >

                                            Loading Members...

                                        </td>

                                    </tr>

                                )

                                :

                                currentUsers.length === 0 ?

                                    (

                                        <tr>

                                            <td

                                                colSpan="6"

                                                className="loading"

                                            >

                                                No Members Found

                                            </td>

                                        </tr>

                                    )

                                    : currentUsers.map((user, index) => (

                                        <tr key={user._id}>

                                            <td>

                                                {indexOfFirstUser + index + 1}

                                            </td>

                                            <td>

                                                {user.fullName}

                                            </td>

                                            <td>

                                                {user.contactNumber}

                                            </td>

                                            <td>

                                                <span className="role">

                                                    {user.role}

                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        user.status === "Active"
                                                            ? "status active"
                                                            : "status inactive"
                                                    }
                                                >

                                                    {user.status}

                                                </span>

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button

                                                        className="edit-btn"

                                                        title="Edit Member"

                                                        onClick={() => navigate(`/users/edit/${user._id}`)}

                                                    >

                                                        <FaEdit />

                                                    </button>
                                                    <button

                                                        className="delete-btn"

                                                        onClick={() => deleteUser(user._id)}

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

            {/* ==========================
                Pagination
            =========================== */}

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

                            Page {currentPage} of {totalPages}

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

export default Users;