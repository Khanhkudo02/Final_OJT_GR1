import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from '../firebaseConfig';
import bcrypt from 'bcryptjs';
import moment from 'moment';

const db = database;
const storageInstance = storage;

const postCreateEmployee = async (name, email, password, dateOfBirth, address, phoneNumber, skills, status, imageFile) => {
    try {
        const newEmployeeRef = push(ref(db, 'users'));

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = null;
        if (imageFile) {
            const imageRef = storageRef(storageInstance, `images/${newEmployeeRef.key}/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Format dateOfBirth if provided
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
            imageUrl,
            isAdmin: false,
            role: "employee",
            status,
        });

        return newEmployeeRef.key;
    } catch (error) {
        console.error("Failed to create employee:", error);
        throw error;
    }
};

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

const putUpdateEmployee = async (id, name, email, dateOfBirth, address, phoneNumber, skills, status, imageFile) => {
    try {
        const employeeRef = ref(db, `users/${id}`);

        let imageUrl = null;
        if (imageFile) {
            const imageRef = storageRef(storageInstance, `images/${id}/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const formattedDateOfBirth = dateOfBirth ? moment(dateOfBirth).format('YYYY-MM-DD') : null;

        // Define updates object with the fields to be updated
        const updates = {
            name,
            email,
            dateOfBirth: formattedDateOfBirth,
            address,
            phoneNumber,
            skills,
            status, // Ensure status is included
            imageUrl: imageUrl || null,
        };

        // Keep the role and isAdmin fields unchanged
        const employeeSnapshot = await get(employeeRef);
        const currentData = employeeSnapshot.val();
        if (currentData) {
            updates.role = currentData.role; // Ensure role is preserved
            updates.isAdmin = currentData.isAdmin; // Ensure isAdmin is preserved
        }

        await update(employeeRef, updates);

        return id;
    } catch (error) {
        console.error("Failed to update employee:", error);
        throw error;
    }
};

const deleteEmployee = async (id) => {
    try {
        const employeeRef = ref(db, `users/${id}`);
        const employeeSnapshot = await get(employeeRef);
        const employeeData = employeeSnapshot.val();

        if (employeeData && employeeData.status === 'inactive') {
            await remove(employeeRef);
        } else {
            throw new Error("Only employees with status 'inactive' can be deleted.");
        }
    } catch (error) {
        console.error("Failed to delete employee:", error);
        throw error;
    }
};


export { fetchAllEmployees, postCreateEmployee, putUpdateEmployee, deleteEmployee };
