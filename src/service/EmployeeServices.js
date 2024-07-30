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
const putUpdateEmployee = async (id, name, email, dateOfBirth, address, phoneNumber, skills, status, department, imageFile) => {
    try {
        const employeeRef = ref(db, `users/${id}`);
        const employeeSnapshot = await get(employeeRef);
        const currentData = employeeSnapshot.val();

        let imageUrl = currentData?.imageUrl || null;
        if (imageFile) {
            if (imageUrl) {
                // Delete the old image
                const oldImageRef = storageRef(storageInstance, `employee/${id}/${imageUrl.split('/').pop().split('?')[0]}`);
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

        const updates = {
            name,
            email,
            dateOfBirth: formattedDateOfBirth,
            address,
            phoneNumber,
            skills,
            status,
            department,
            imageUrl: imageUrl || null,
        };

        if (currentData) {
            updates.role = currentData.role;
            updates.isAdmin = currentData.isAdmin;
        }

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
        const employeeRef = ref(db, `users/${id}`);
        const employeeSnapshot = await get(employeeRef);
        const employeeData = employeeSnapshot.val();

        if (employeeData && employeeData.status === 'inactive') {
            const imageUrl = employeeData.imageUrl;
            if (imageUrl) {
                const imageName = imageUrl.split('/').pop().split('?')[0];
                const imageRef = storageRef(storageInstance, `images/${id}/${imageName}`);
                await deleteObject(imageRef);
            }

            await remove(employeeRef);
        } else {
            throw new Error("Only employees with status 'inactive' can be deleted.");
        }
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
