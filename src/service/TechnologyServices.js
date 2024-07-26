import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { database, storage } from "../firebaseConfig";

const db = database;
const storageInstance = storage;

// Create new technology
const postCreateTechnology = async (name, description, status, imageFile) => {
    try {
        const newTechnologyRef = push(ref(db, 'technologies'));

        let imageUrl = null;
        if (imageFile) {
            // Upload the image to Firebase Storage
            const imageRef = storageRef(
                storageInstance,
                `images/${newTechnologyRef.key}/${imageFile.name}`
            );
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Save the technology data along with image URL (if available)
        await set(newTechnologyRef, {
            name,
            description,
            status,
            imageUrl, // Correct key name to match your data structure
            createdAt: Date.now(),
        });

        return newTechnologyRef.key;
    } catch (error) {
        console.error("Failed to create technology:", error);
        throw error;
    }
};

// Fetch all technologies
const fetchAllTechnology = async () => {
    try {
        const technologiesRef = ref(database, "technologies");
        const snapshot = await get(technologiesRef);
        const data = snapshot.val();
        return data
            ? Object.entries(data).map(([key, value]) => ({ key, ...value }))
            : [];
    } catch (error) {
        console.error("Failed to fetch technologies:", error);
        throw error;
    }
};

// Update existing technology
const putUpdateTechnology = async (id, name, description, status, imageFile) => {
    try {
        const technologyRef = ref(db, `technologies/${id}`);

        let imageUrl = null;
        if (imageFile) {
            const imageRef = storageRef(
                storageInstance,
                `images/${id}/${imageFile.name}`
            );
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        await update(technologyRef, {
            name,
            description,
            status,
            imageUrl: imageUrl || null, // Ensure imageUrl is updated or set to null
        });

        return id;
    } catch (error) {
        console.error("Failed to update technology:", error);
        throw error;
    }
};

// Delete technology
const deleteTechnology = async (id) => {
    try {
        const technologyRef = ref(db, `technologies/${id}`);
        const technologySnapshot = await get(technologyRef);

        // Delete image from Firebase Storage
        const imageUrl = technologySnapshot.val()?.imageUrl;
        if (imageUrl) {
            const imageName = imageUrl.split('/').pop().split('?')[0]; // Extract file name from URL
            const imageRef = storageRef(storageInstance, `images/${id}/${imageName}`);
            await deleteObject(imageRef);
        }

        // Delete technology from Realtime Database
        await remove(technologyRef);
    } catch (error) {
        console.error("Failed to delete technology:", error);
        throw error;
    }
};

// Fetch technology by ID
const fetchTechnologyById = async (id) => {
    try {
        console.log(`Fetching technology with ID: ${id}`); // Debug
        const technologyRef = ref(db, `technologies/${id}`);
        const snapshot = await get(technologyRef);
        console.log('Technology data:', snapshot.val()); // Debug
        return snapshot.val();
    } catch (error) {
        console.error("Failed to fetch technology by ID:", error);
        throw error;
    }
};

export { fetchAllTechnology, postCreateTechnology, putUpdateTechnology, deleteTechnology, fetchTechnologyById };
