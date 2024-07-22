import { get, getDatabase, ref, set, remove, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Components/LogoutButton";

function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role is employee
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users when the page loads
    const fetchUsers = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, "users");
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          setUsers(Object.values(userData));
        }
      } catch (error) {
        console.error("Error fetching users: ", error);
        setError("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.role !== "admin") {
      navigate("/employee"); // Redirect if not admin
    }
  }, [navigate]);

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${email.replace(".", ",")}`);
      let userData = {
        email,
        password,
        contact: "",
        cv_list: [
          {
            title: "",
            description: "",
            file: "",
            updatedAt: new Date().toISOString(),
          },
        ],
        role: email === "admin@gmail.com" ? "admin" : "employee",
        createdAt: new Date().toISOString(),
        projetcIds: "",
        skill: "",
        Status: "",
      };

      //Fetch all users to get the data of the initial employee
      const snapshot = await get(ref(db, "users"));
      const usersData = snapshot.val();
      // let defaultEmployeeData = {};
      // const initialEmployee = Object.values(usersData).find(user => user.role === 'employee');

      // If initial employee exists, copy their data
      // if (initialEmployee) {
      //   defaultEmployeeData = {
      //     ...initialEmployee,
      //     email: '', // Don't copy the email of the current user
      //     password: '', // Don't copy the password of the current user
      //     role: '', // Don't copy the role of the current user
      //     createdAt: new Date().toISOString()
      //   };
      //   // Optionally include more default fields if needed
      // }

      if (editMode) {
        await update(userRef, userData);
        setSuccessMessage("User updated successfully!");
      } else {
        if (role === "admin") {
          // Only the initial admin can have isAdmin set to true
          const adminUsers = Object.values(usersData).filter(
            (user) => user.role === "admin"
          );
          if (adminUsers.length === 0) {
            userData.isAdmin = true; // The very first admin has isAdmin = true
          } else {
            userData.isAdmin = false; // Other admins do not have isAdmin field
          }
        } else if (role === "employee") {
          userData = {
            email,
            password,
            contact: "",
            cv_list: [
              {
                title: "",
                description: "",
                file: "",
                updatedAt: new Date().toISOString(),
              },
            ],
            role: email === "admin@gmail.com" ? "admin" : "employee",
            createdAt: new Date().toISOString(),
            projetcIds: "",
            skill: "",
            Status: "",
          };
        }

        await set(userRef, userData);
        setSuccessMessage("User added successfully!");
      }
      setEmail("");
      setPassword("");
      setRole("employee");
      setError("");
      setEditMode(false);
      setEditUserEmail("");

      // Update user list
      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        setUsers(Object.values(updatedUserData));
      }
    } catch (error) {
      console.error("Error adding or updating user: ", error);
      setError("Error adding or updating user");
    }
  };

  const handleDeleteUser = async (userEmail) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userEmail.replace(".", ",")}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      // Prevent deletion of the initial admin user
      const adminUsers = users.filter((user) => user.isAdmin);

      if (userData.isAdmin && adminUsers.length === 1) {
        setError("Cannot delete the only admin user");
        return;
      }

      if (userData.isAdmin) {
        setError("Cannot delete an admin user");
        return;
      }

      await remove(userRef);
      setSuccessMessage("User deleted successfully!");

      // Update user list
      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        setUsers(Object.values(updatedUserData));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      setError("Error deleting user");
    }
  };

  const handleEditUser = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
    setEditMode(true);
    setEditUserEmail(user.email);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <form onSubmit={handleAddOrUpdateUser}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={editMode}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit">{editMode ? "Update User" : "Add User"}</button>
        <LogoutButton />
      </form>
      <h2>Current Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.email}>
            {user.email} - {user.role}
            <button onClick={() => handleEditUser(user)}>Edit</button>
            {!user.isAdmin && (
              <button onClick={() => handleDeleteUser(user.email)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
