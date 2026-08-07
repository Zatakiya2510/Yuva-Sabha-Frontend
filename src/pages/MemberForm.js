import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";

import Layout from "../components/layout/Layout";

import api from "../services/api";

import "./MemberForm.css";

const MemberForm = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({

        fullName: "",

        contactNumber: "",

        role: "Member",

        status: "Active",

    });

    /*
    ======================================
    Handle Input Change
    ======================================
    */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    /*
    ======================================
    Get Member Details
    ======================================
    */

    const fetchMember = async () => {

        try {

            setLoading(true);

            const { data } = await api.get(

                `/users/${id}`

            );

            setFormData({

                fullName:

                    data.data.fullName || "",

                contactNumber:

                    data.data.contactNumber || "",

                role:

                    data.data.role || "Member",

                status:

                    data.data.status || "Active",

            });

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to load member."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /*
    ======================================
    Load Existing Member
    ======================================
    */

    useEffect(() => {

        if (isEdit) {

            fetchMember();

        }

    }, [id]);

    /*
    ======================================
    Save / Update
    ======================================
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.fullName.trim()) {

            return toast.error(

                "Full Name is required."

            );

        }

        if (

            !/^[6-9]\d{9}$/.test(

                formData.contactNumber

            )

        ) {

            return toast.error(

                "Enter a valid Contact Number."

            );

        }

        try {

            setSaving(true);

            if (isEdit) {

                await api.put(

                    `/users/${id}`,

                    formData

                );

                toast.success(

                    "Member updated successfully."

                );

            }

            else {

                await api.post(

                    "/users",

                    formData

                );

                toast.success(

                    "Member created successfully."

                );

            }

            setTimeout(() => {

                navigate("/users");

            }, 1000);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Something went wrong."

            );

        }

        finally {

            setSaving(false);

        }

    };

    return (

        <Layout>

            <Toaster position="top-right" />

            <div className="member-form-page">

                <div className="member-form-header">

                    <div>

                        <h2>

                            {

                                isEdit

                                    ? "Edit Member"

                                    : "Add Member"

                            }

                        </h2>

                        <p>

                            {

                                isEdit

                                    ? "Update member information."

                                    : "Register a new member."

                            }

                        </p>

                    </div>

                </div>

                {
                    loading
                        ?
                        <div className="loading-box">

                            Loading...

                        </div>
                        :
                        <form
                            className="member-form"
                            onSubmit={handleSubmit}
                        >                        <div className="form-grid">

                                <div className="form-group">

                                    <label>

                                        Full Name

                                    </label>

                                    <input

                                        type="text"

                                        name="fullName"

                                        placeholder="Enter Full Name"

                                        value={formData.fullName}

                                        onChange={handleChange}

                                    />

                                </div>

                                <div className="form-group">

                                    <label>

                                        Contact Number

                                    </label>

                                    <input

                                        type="text"

                                        name="contactNumber"

                                        placeholder="Enter Contact Number"

                                        value={formData.contactNumber}

                                        onChange={handleChange}

                                        maxLength={10}

                                    />

                                </div>

                                <div className="form-group">

                                    <label>

                                        Role

                                    </label>

                                    <select

                                        name="role"

                                        value={formData.role}

                                        onChange={handleChange}

                                    >

                                        <option value="Member">

                                            Member

                                        </option>

                                        <option value="Admin">

                                            Admin

                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>

                                        Status

                                    </label>

                                    <select

                                        name="status"

                                        value={formData.status}

                                        onChange={handleChange}

                                    >

                                        <option value="Active">

                                            Active

                                        </option>

                                        <option value="Inactive">

                                            Inactive

                                        </option>

                                    </select>

                                </div>

                            </div>

                            <div className="form-actions">

                                <button

                                    type="button"

                                    className="cancel-btn"

                                    onClick={() => navigate("/users")}

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

                                                    "Update Member"

                                                    :

                                                    "Save Member"

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

export default MemberForm;