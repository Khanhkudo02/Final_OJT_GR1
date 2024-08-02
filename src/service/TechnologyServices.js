import { ref, set, push, update, get, remove } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebaseConfig";

// Function to create a technology
const postCreateTechnology = async (
  name,
  description,
  status,
  imageUrl
) => {
  try {
    const newTechRef = push(ref(database, "technologies"));
    await set(newTechRef, {
      name,
      description,
      status,
      imageUrl,
    });
    return newTechRef.key;
  } catch (error) {
    console.error("Error creating technology:", error);
    throw error;
  }
};

// Function to fetch a technology by ID
const fetchTechnologyById = async (id) => {
  try {
    const technologyRef = ref(database, `technologies/${id}`);
    const snapshot = await get(technologyRef);

    if (!snapshot.exists()) {
      throw new Error("Technology not found.");
    }

    return snapshot.val();
  } catch (error) {
    console.error("Error fetching technology:", error);
    throw error;
  }
};

// Function to fetch all technologies
const fetchAllTechnology = async () => {
  try {
    const techRef = ref(database, 'technologies');
    const snapshot = await get(techRef);
    const data = snapshot.val();
    
    // Trả về mảng các đối tượng với key và value
    return data ? Object.entries(data).map(([key, value]) => ({
      key,          // Khóa từ Firebase
      ...value,     // Giá trị từ Firebase
    })) : [];
  } catch (error) {
    console.error("Error fetching technologies:", error);
    throw error;
  }
};

// Function to update a technology
const putUpdateTechnology = async (
  id,
  name,
  description,
  status,
  imageUrl
) => {
  try {
    const techRef = ref(database, `technologies/${id}`);
    await update(techRef, {
      name,
      description,
      status,
      imageUrl,
    });
  } catch (error) {
    console.error("Error updating technology:", error);
    throw error;
  }
};

// Function to delete a technology
const deleteTechnology = async (id) => {
  try {
    const techRef = ref(database, `technologies/${id}`);
    await remove(techRef);
  } catch (error) {
    console.error("Error deleting technology:", error);
    throw error;
  }
};

export { postCreateTechnology, fetchTechnologyById, fetchAllTechnology, putUpdateTechnology, deleteTechnology }