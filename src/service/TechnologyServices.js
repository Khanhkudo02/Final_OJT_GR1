import { ref as dbRef, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { database, storage } from "../firebaseConfig";

// Create new technology
const postCreateTechnology = async (name, description, status, imageUrl) => {
    try {
        const newTechnologyRef = push(dbRef(database, "technologies"));

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
        const technologiesRef = dbRef(database, "technologies");
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
        const technologyRef = dbRef(database, `technologies/${id}`);

        let imageUrl = null;
        if (imageFile) {
            // Delete old image from Firebase Storage
            if (oldImageURL) {
                const oldImagePath = oldImageURL.split("/o/")[1].split("?")[0];
                const decodedOldImagePath = decodeURIComponent(oldImagePath);
                const oldImageRef = storageRef(storage, decodedOldImagePath);
                await deleteObject(oldImageRef);
            }

            // Upload new image
            const imageRef = storageRef(
                storage,
                `technology/${id}/${imageFile.name}`
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
        const technologyRef = dbRef(database, `technologies/${id}`);
        const technologySnapshot = await get(technologyRef);

        if (!technologySnapshot.exists()) {
            throw new Error("Technology not found");
        }

        // Delete image from Firebase Storage
        const imageUrl = technologySnapshot.val().imageURL;
        if (imageUrl) {
            // Extract the path from the image URL
            const imagePath = imageUrl.split("/o/")[1].split("?")[0];
            const decodedImagePath = decodeURIComponent(imagePath);
            const imageStorageRef = storageRef(storage, decodedImagePath);
            await deleteObject(imageStorageRef);
        }

        // Delete technology from Realtime Database
        await remove(technologyRef);
    } catch (error) {
        console.error("Failed to delete technology:", error);
        throw error;
    }
};

export { fetchAllTechnology, postCreateTechnology, putUpdateTechnology, deleteTechnology };
