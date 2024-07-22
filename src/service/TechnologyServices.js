import { getDatabase, ref, get, set, update } from "firebase/database";
import { database } from "../../firebaseConfig";

// Fetch all technologies
const fetchAllTechnology = async () => {
    const dbRef = ref(database, 'technologies');
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map(key => ({ key, ...data[key] }));
        } else {
            console.log("No data available");
            return [];
        }
    } catch (error) {
        console.error("Error fetching technologies:", error);
        throw error;
    }
};

// Create a new technology
const postCreateTechnology = async (name, description, status) => {
    const dbRef = ref(database, 'technologies');
    const newTechnologyRef = ref(database, `technologies/${Date.now()}`);
    const newTechnology = {
        title: name,
        information: description,
        company: status
    };

    try {
        await set(newTechnologyRef, newTechnology);
        return { status: 201, data: newTechnology };
    } catch (error) {
        console.error("Error creating technology:", error);
        throw error;
    }
};

// Update an existing technology
const putUpdateTechnology = async (id, name, description, status) => {
    const dbRef = ref(database, `technologies/${id}`);
    const updatedTechnology = {
        title: name,
        information: description,
        company: status
    };

    try {
        await update(dbRef, updatedTechnology);
        return { status: 200, data: updatedTechnology };
    } catch (error) {
        console.error("Error updating technology:", error);
        throw error;
    }
};

export { fetchAllTechnology, postCreateTechnology, putUpdateTechnology };
