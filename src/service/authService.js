// src/services/authService.js

import { getDatabase, ref, query, orderByChild, equalTo, get, set } from 'firebase/database';

// Hàm đăng nhập người dùng
export const loginUser = async (e, email, password, setUser, setError, navigate) => {
  e.preventDefault();
  
  try {
    const db = getDatabase();
    const userRef = ref(db, 'users');
    const userQuery = query(userRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(userQuery);
    const userData = snapshot.val();
    
    console.log("User Data from DB:", userData); // Console log user data

    if (userData) {
      const userId = Object.keys(userData)[0];
      const user = userData[userId];


      if (user.password === password) {
        localStorage.setItem("userId", JSON.stringify(user)); // Lưu toàn bộ đối tượng người dùng
        setUser(user);
        
        // Điều hướng dựa trên vai trò người dùng
        navigate(user.role === 'admin' ? '/admin' : '/employee');
        return { user, error: null };
      } else {
        return { user: null, error: "Invalid password" };
      }
    } else {
      return { user: null, error: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { user: null, error: "An error occurred" };
  }
};

// Hàm đăng ký người dùng
export const signUpUser = async (e, email, password, setSuccessMessage, setError) => {
  e.preventDefault();
  
  try {
    const db = getDatabase();
    const userRef = ref(db, 'users');
    const userQuery = query(userRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(userQuery);
    
    console.log("Snapshot for Sign Up Check:", snapshot.val()); // Console log snapshot for sign up

    if (snapshot.val()) {
      setError("Email already in use");
      return { success: false, error: "Email already in use" };
    }

    const newUserRef = ref(db, `users/${email.replace('.', ',')}`);
    const newUser = {
      email,
      password,
      contact: '',
      cv_list: [{
        title: "",
        description: '',
        file: '',
        updatedAt: new Date().toISOString()
      }],
      role: email === "admin@gmail.com" ? "admin" : "employee",
      createdAt: new Date().toISOString(),
      projetcIds: '',
      skill: '',
      Status: ''
    };
    await set(newUserRef, newUser);
    
    console.log("New User Object:", newUser); // Console log the new user object

    setSuccessMessage("Account created successfully! Please log in.");
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error signing up: ", error);
    setError("An error occurred during sign up");
    return { success: false, error: "An error occurred during sign up" };
  }
};