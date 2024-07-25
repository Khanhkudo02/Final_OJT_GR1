import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { database, storage } from "../firebaseConfig";

// Create new technology
const postCreateTechnology = async (name, description, status, imageUrl) => {
    try {
        const newTechnologyRef = push(ref(database, "technologies"));

        // Save the technology data along with image URL (if available)
        await set(newTechnologyRef, {
            name,
            description,
            status,
            imageURL: imageUrl,
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
const putUpdateTechnology = async (
    id,
    name,
    description,
    status,
    imageFile,
    oldImageURL
) => {
    try {
        const technologyRef = ref(database, `technologies/${id}`);

        let imageUrl = null;
        if (imageFile) {
            // Delete old image from Firebase Storage
            if (oldImageURL) {
                const oldImageRef = storageRef(storage, `images/${id}/${oldImageURL.split('/').pop().split('?')[0]}`);
                await deleteObject(oldImageRef);
            }

            // Upload new image
            const imageRef = storageRef(
                storage,
                `images/${id}/${imageFile.name}`
            );
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        } else {
            // Use the old image URL if no new image is uploaded
            imageUrl = oldImageURL;
        }

        // Update technology data
        await update(technologyRef, {
            name,
            description,
            status,
            imageURL: imageUrl,
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
        const technologyRef = ref(database, `technologies/${id}`);
        const technologySnapshot = await get(technologyRef);

        // Delete image from Firebase Storage
        const imageUrl = technologySnapshot.val()?.imageURL;
        if (imageUrl) {
            const imageName = imageUrl.split("/").pop().split("?")[0]; // Extract file name from URL
            const imageRef = storageRef(storage, `images/${id}/${imageName}`);
            await deleteObject(imageRef);
        }

        // Delete technology from Realtime Database
        await remove(technologyRef);
    } catch (error) {
        console.error("Failed to delete technology:", error);
        throw error;
    }
};

export { fetchAllTechnology, postCreateTechnology, putUpdateTechnology, deleteTechnology };
