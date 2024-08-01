import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from '../firebaseConfig';
import bcrypt from 'bcryptjs';
import moment from 'moment';

const db = database;
const storageInstance = storage;

// Create new employee
const postCreateEmployee = async (name, email, password, dateOfBirth, address, phoneNumber, skills, status, department, role, imageFile) => {
    try {
        const newEmployeeRef = push(ref(db, 'users'));

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = null;
        if (imageFile) {
            const timestamp = Date.now();
            const filename = `${timestamp}_${imageFile.name}`;
            const imageRef = storageRef(storageInstance, `employee/${newEmployeeRef.key}/${filename}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const formattedDateOfBirth = dateOfBirth ? moment(dateOfBirth).format('YYYY-MM-DD') : null;

        await set(newEmployeeRef, {
            name,
            email,
            password: hashedPassword,
            dateOfBirth: formattedDateOfBirth,
            address,
            phoneNumber,
            skills,
            status,
            department,  // Added department
            imageUrl,
            isAdmin: false,
            role: role || "employee", // Default to "employee" if role is not provided
            createdAt: Date.now(), // Automatically set the createdAt attribute
        });

        return newEmployeeRef.key;
    } catch (error) {
        console.error("Failed to create employee:", error);
        throw error;
    }
};

// Fetch all employees
const fetchAllEmployees = async () => {
    try {
        const employeesRef = ref(db, 'users');
        const snapshot = await get(employeesRef);
        const data = snapshot.val();
        return data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
    } catch (error) {
        console.error("Failed to fetch employees:", error);
        throw error;
    }
};

// Update existing employee
const putUpdateEmployee = async (id, name, email, dateOfBirth, address, phoneNumber, skills, status, department, imageFile, oldImageUrl) => {
    try {
        const employeeRef = ref(db, `users/${id}`);
        const employeeSnapshot = await get(employeeRef);
        const currentData = employeeSnapshot.val();

        let imageUrl = currentData?.imageUrl || null;

        if (imageFile) {
            if (imageUrl) {
                // Delete the old image
                const oldImagePath = imageUrl.split("/o/")[1].split("?")[0];
                const decodedOldImagePath = decodeURIComponent(oldImagePath);
                const oldImageRef = storageRef(storageInstance, decodedOldImagePath);
                await deleteObject(oldImageRef);
            }

            // Upload the new image
            const timestamp = Date.now();
            const filename = `${timestamp}_${imageFile.name}`;
            const imageRef = storageRef(storageInstance, `employee/${id}/${filename}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const formattedDateOfBirth = dateOfBirth ? moment(dateOfBirth).format('YYYY-MM-DD') : null;

        // Prepare the updates for the employee
        const updates = {
            name,
            email,
            dateOfBirth: formattedDateOfBirth,
            address,
            phoneNumber,
            skills,
            status,
            department,
            imageUrl: imageUrl || currentData.imageUrl, // Use the new image URL or keep the old one
        };

        if (currentData) {
            updates.role = currentData.role;
            updates.isAdmin = currentData.isAdmin;
        }

        // Update employee data
        await update(employeeRef, updates);

        return id;
    } catch (error) {
        console.error("Failed to update employee:", error);
        throw error;
    }
};


// Delete employee
const deleteEmployeeById = async (id) => {
    try {
        const employeeRef = ref(database, `users/${id}`);
        const employeeSnapshot = await get(employeeRef);

        if (!employeeSnapshot.exists()) {
            throw new Error("Employee not found");
        }

        const employeeData = employeeSnapshot.val();

        // Check if the employee is inactive before attempting to delete
        if (employeeData.status !== 'inactive') {
            throw new Error("Only employees with status 'inactive' can be deleted.");
        }

        // Delete images from Firebase Storage
        const imageUrl = employeeData.imageUrl;
        if (imageUrl) {
            const imagePath = imageUrl.split("/o/")[1].split("?")[0];
            const decodedImagePath = decodeURIComponent(imagePath);
            const imageStorageRef = storageRef(storage, decodedImagePath);
            await deleteObject(imageStorageRef);
        }

        // Delete employee from Realtime Database
        await remove(employeeRef);
    } catch (error) {
        console.error("Failed to delete employee:", error);
        throw error;
    }
};

// Fetch employee by ID
const fetchEmployeeById = async (id) => {
    try {
        const employeeRef = ref(database, `users/${id}`);
        const snapshot = await get(employeeRef);
        return snapshot.val();
    } catch (error) {
        console.error("Failed to fetch employee by ID:", error);
        throw error;
    }
};

export { fetchAllEmployees, postCreateEmployee, putUpdateEmployee, deleteEmployeeById, fetchEmployeeById };