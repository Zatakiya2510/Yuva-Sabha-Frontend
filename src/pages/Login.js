import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FaUserShield, FaPhoneAlt, FaLock } from "react-icons/fa";

import api from "../services/api";
import "./Login.css";

const Login = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        contactNumber: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.contactNumber.trim()) {

            return toast.error("Contact Number is required");

        }

        if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {

            return toast.error("Enter a valid contact number");

        }

        if (!formData.password.trim()) {

            return toast.error("Password is required");

        }

        try {

            setLoading(true);

            const { data } = await api.post(
                "/auth/login",
                formData
            );

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            toast.success(data.message);

            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Login Failed"

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <>

            <Toaster position="top-right" />

            <div className="login-container">

                {/* Left Side */}

                <div className="login-left">

                    <h1>

                        Attendance

                        <br />

                        Management System

                    </h1>

                    <p>

                        Manage Members, Events,

                        Attendance and Reports

                        from one dashboard.

                    </p>

                </div>

                {/* Right Side */}

                <div className="login-right">

                    <div className="login-card">

                        <div className="login-logo">

                            <FaUserShield />

                        </div>

                        <h2>

                            Admin Login

                        </h2>

                        <p>

                            Welcome Back

                        </p>

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="input-group">

                                <FaPhoneAlt />

                                <input

                                    type="text"

                                    name="contactNumber"

                                    placeholder="Contact Number"

                                    value={formData.contactNumber}

                                    onChange={handleChange}

                                />

                            </div>

                            <div className="input-group">

                                <FaLock />

                                <input

                                    type="password"

                                    name="password"

                                    placeholder="Password"

                                    value={formData.password}

                                    onChange={handleChange}

                                />

                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading}
                            >

                                {

                                    loading

                                        ?

                                        "Logging In..."

                                        :

                                        "Login"

                                }

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

};

export default Login;