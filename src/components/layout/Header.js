import "./Header.css";

const Header = () => {

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    return (

        <div className="header">

            <div>

                <h2>Attendance Management</h2>

                <span>
                    Dashboard
                </span>

            </div>

            <div className="profile">

                <div className="avatar">
                    {user.fullName
                        ? user.fullName.charAt(0)
                        : "A"}
                </div>

                <div>

                    <strong>
                        {user.fullName || "Admin"}
                    </strong>

                    <p>
                        {user.role || "Administrator"}
                    </p>

                </div>

            </div>

        </div>

    );

};

export default Header;