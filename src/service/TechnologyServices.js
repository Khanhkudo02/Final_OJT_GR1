import { ref as dbRef, set, push, update, get, remove } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { database, storage } from "../firebaseConfig";

// Create new technology
const postCreateTechnology = async (name, description, status, imageUrls) => {
  try {
    const newTechnologyRef = push(dbRef(database, "technologies"));

    // Save the technology data along with image URLs (if available)
    await set(newTechnologyRef, {
      name,
      description,
      status,
      imageURLs: imageUrls, // Store image URLs as an array
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
const putUpdateTechnology = async (id, name, description, status, imageURLs, oldImageURLs) => {
  try {
    const technologyRef = dbRef(database, `technologies/${id}`);

    // Update technology data
    await update(technologyRef, {
      name,
      description,
      status,
      imageURLs,
    });

    // Delete old images from Firebase Storage if needed
    const imagesToDelete = oldImageURLs.filter(url => !imageURLs.includes(url));
    await Promise.all(imagesToDelete.map(async (url) => {
      const oldImagePath = url.split("/o/")[1].split("?")[0];
      const decodedOldImagePath = decodeURIComponent(oldImagePath);
      const oldImageRef = storageRef(storage, decodedOldImagePath);
      await deleteObject(oldImageRef);
    }));

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

    // Delete images from Firebase Storage
    const imageUrls = technologySnapshot.val().imageURLs;
    if (imageUrls) {
      await Promise.all(imageUrls.map(async (url) => {
        const imagePath = url.split("/o/")[1].split("?")[0];
        const decodedImagePath = decodeURIComponent(imagePath);
        const imageStorageRef = storageRef(storage, decodedImagePath);
        await deleteObject(imageStorageRef);
      }));
    }

    // Delete technology from Realtime Database
    await remove(technologyRef);
  } catch (error) {
    console.error("Failed to delete technology:", error);
    throw error;
  }
};

export { fetchAllTechnology, postCreateTechnology, putUpdateTechnology, deleteTechnology };
