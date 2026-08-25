import { useState } from "react";
import "./Home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("email");

    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem("student"));

    function changeTheme(e) {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }

    async function getusers(pageNumber = page) {
        try {
            const response = await axios.get(
                `http://localhost:8080/get/page?page=${pageNumber}&size=6`
            );

            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
        } catch (err) {
            console.log(err);
            alert("Failed to get users");
        }
    }

    async function searchUser() {
        if (search.trim() === "") {
            alert("Please enter name or email");
            return;
        }

        try {
            if (searchType === "email") {
                const response = await axios.get(
                    `http://localhost:8080/search/email?email=${encodeURIComponent(search)}`
                );

                setUsers([response.data]);
            } else {
                const response = await axios.get(
                    `http://localhost:8080/search/name?name=${encodeURIComponent(search)}`
                );

                setUsers(response.data);
            }

            setTotalPages(0);
        } catch (err) {
            console.log(err);

            if (err.response?.status === 404) {
                alert("User Not Found");
            } else {
                alert("Search Failed");
            }

            setUsers([]);
        }
    }

    function clearSearch() {
        setSearch("");
        setPage(0);
        getusers(0);
    }

    async function updateuser(user) {
        const newName = prompt("Enter new name:", user.name);
        const newEmail = prompt("Enter new email:", user.email);

        if (newName === null || newEmail === null) {
            return;
        }

        const updatedDetails = {
            name: newName,
            email: newEmail
        };

        try {
            await axios.put(
                `http://localhost:8080/update/${user.id}`,
                updatedDetails
            );

            alert("User Updated Successfully");
            getusers(page);
        } catch (err) {
            console.log(err);
            alert("User Update failed");
        }
    }

    async function deleteByID(id) {
        const confirmLogout = window.confirm(
            "Are you sure you want to delete?"
        );

        if (!confirmLogout) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8080/delete/${id}`
            );

            alert("User Deleted Successfully");
            getusers(page);
        } catch (err) {
            console.log(err);
            alert("User failed to delete");
        }
    }

    function previousPage() {
        if (page > 0) {
            getusers(page - 1);
        }
    }

    function nextPage() {
        if (page < totalPages - 1) {
            getusers(page + 1);
        }
    }

    function logout() {
        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("student");
        navigate("/login");
    }

    return (
        <div className={`home-page ${theme}`}>

   <div className="dashboard-header">
    <h1>Dashboard</h1>

    <div className="header-options">
        <div className="theme-box">
            <label>Theme</label>

            <select value={theme} onChange={changeTheme}>
                <option value="default">Default</option>
                <option value="dark">Dark</option>
            </select>
        </div>

        <button className="logout" onClick={logout}>
            Logout
        </button>
    </div>
</div>

            <h2>
                Welcome {student?.name || "User"}!
            </h2>

            <button
                className="get"
                onClick={() => getusers(0)}
            >
                Get Users
            </button>

            <br />
            <br />

            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={searchType}
                    onChange={(e) =>
                        setSearchType(e.target.value)
                    }
                >
                    <option value="email">
                        Search by Email
                    </option>

                    <option value="name">
                        Search by Name
                    </option>
                </select>

                <button onClick={searchUser}>
                    Search
                </button>

                <button onClick={clearSearch}>
                    Clear
                </button>

            </div>

            <br />

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Update</th>
                        <th>Delete</th>
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
                                    <button
                                        className="up"
                                        onClick={() =>
                                            updateuser(user)
                                        }
                                    >
                                        Update
                                    </button>
                                </td>

                                <td>
                                    <button
                                        className="de"
                                        onClick={() =>
                                            deleteByID(user.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td colSpan="5">
                                No Users Found
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

            <br />

            {totalPages > 0 && (

                <div className="pagination">

                    <button
                        className="pre22"
                        onClick={previousPage}
                        disabled={page === 0}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        className="next22"
                        onClick={nextPage}
                        disabled={
                            page >= totalPages - 1
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </div>
    );
}

export default Home;