import "./Home.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [token] = useState(localStorage.getItem("Token"));
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("email");

    const studentData = localStorage.getItem("student");
    const student = studentData ? JSON.parse(studentData) : null;

    const logout = useCallback(() => {
        localStorage.removeItem("Token");
        localStorage.removeItem("student");
        navigate("/login");
    }, [navigate]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const verifySession = async () => {
            try {
                await axios.get("http://localhost:8080/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.log(error);
                alert("Session Expired. Please login again.");
                logout();
            }
        };

        verifySession();

        const interval = setInterval(verifySession, 5000);

        return () => clearInterval(interval);
    }, [token, navigate, logout]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const getUsers = async (pageNumber = 0) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/get/page?page=${pageNumber}&size=6&sortDirection=asc`
            );

            setUsers(response.data.content);
            setPage(response.data.number);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
            alert("Failed to get users");
        }
    };

    const searchUser = async () => {
        if (!search.trim()) {
            getUsers(0);
            return;
        }

        try {
            let response;

            if (searchType === "email") {
                response = await axios.get(
                    `http://localhost:8080/search/email/${encodeURIComponent(search)}`
                );
            } else {
                response = await axios.get(
                    `http://localhost:8080/search/name/${encodeURIComponent(search)}`
                );
            }

            setUsers(Array.isArray(response.data) ? response.data : [response.data]);
            setTotalPages(0);
        } catch (error) {
            console.log(error);
            alert("User not found");
            setUsers([]);
        }
    };

    const clearSearch = () => {
        setSearch("");
        getUsers(0);
    };

    const updateUser = async (user) => {
        const name = prompt("Enter new name", user.name);
        const email = prompt("Enter new email", user.email);

        if (!name || !email) {
            return;
        }

        try {
            await axios.put(
                `http://localhost:8080/update/${user.id}`,
                {
                    name: name,
                    email: email
                }
            );

            alert("User updated successfully");
            getUsers(page);
        } catch (error) {
            console.log(error);
            alert("Failed to update user");
        }
    };

    const deleteByID = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/delete/${id}`);

            alert("User deleted successfully");
            getUsers(page);
        } catch (error) {
            console.log(error);
            alert("Failed to delete user");
        }
    };

    const previousPage = () => {
        if (page > 0) {
            getUsers(page - 1);
        }
    };

    const nextPage = () => {
        if (page < totalPages - 1) {
            getUsers(page + 1);
        }
    };

    return (
        <div className={`home-container ${theme}`}>

            <header className="home-header">

                <h1>Student Management System</h1>

                <div className="header-actions">

                    <select
                        aria-label="Theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="black">Black</option>
                        <option value="red">Red</option>
                        <option value="purple">Purple</option>
                        <option value="yellow">Yellow</option>
                    </select>

                    <button className="btn logout-button" onClick={logout}>
                        Logout
                    </button>

                </div>

            </header>

            <main className="home-content">

                <div className="welcome-bar">

                    <h2>Welcome {student?.name || "Student"}</h2>

                    <div className="home-actions">

                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate("/sms")}
                        >
                            Send SMS
                        </button>

                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate("/weather")}
                        >
                            Check Weather
                        </button>

                    </div>

                </div>

                <div className="toolbar">

                    <button
                        className="btn btn-primary"
                        onClick={() => getUsers(0)}
                    >
                        Get Users
                    </button>

                    <div className="search-container">

                        <select
                            className="field"
                            aria-label="Search by"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="email">Email</option>
                            <option value="name">Name</option>
                        </select>

                        <input
                            className="field"
                            type="text"
                            placeholder={`Search by ${searchType}`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchUser()}
                        />

                        <button className="btn btn-primary" onClick={searchUser}>
                            Search
                        </button>

                        <button className="btn btn-ghost" onClick={clearSearch}>
                            Clear
                        </button>

                    </div>

                </div>

                <div className="table-card">
                    <div className="table-scroll">
                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>

                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>

                                            <td>
                                                <div className="row-actions">

                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => updateUser(user)}
                                                    >
                                                        Update
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteByID(user.id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="empty-row" colSpan="4">
                                            No users found
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>
                    </div>
                </div>

                {totalPages > 0 && (
                    <div className="pagination">

                        <button
                            className="btn btn-primary pre22"
                            onClick={previousPage}
                            disabled={page === 0}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page + 1} of {totalPages}
                        </span>

                        <button
                            className="btn btn-primary next22"
                            onClick={nextPage}
                            disabled={page >= totalPages - 1}
                        >
                            Next
                        </button>

                    </div>
                )}

            </main>

        </div>
    );
}

export default Home;
