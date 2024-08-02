import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from "../firebaseConfig";

// Function to create a technology
export const postCreateTechnology = async (id, name, description, status, imageUrl) => {
  try {
    const techRef = ref(database, `technologies/${id}`);
    await set(techRef, {
      name,
      description,
      status,
      imageUrl
    });
  } catch (error) {
    console.error("Error creating technology:", error);
    throw error;
  }
};

export const fetchTechnologyById = async (id) => {
  try {
    console.log(`Attempting to fetch technology with ID: ${id}`); // Debug log
    const technologyRef = ref(database, `technologies/${id}`);
    const snapshot = await get(technologyRef);
    
    if (!snapshot.exists()) {
      console.error(`No technology found with ID: ${id}`); // Debug log
      throw new Error("Technology not found.");
    }
    
    console.log('Fetched Technology data:', snapshot.val()); // Debug log
    return snapshot.val();
  } catch (error) {
    console.error("Error fetching technology:", error);
    throw error;
  }
};
// Function to fetch all technologies
export const fetchAllTechnology = async () => {
  try {
    const techRef = ref(database, 'technologies');
    const snapshot = await get(techRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key, // Correctly assign the key as the ID
        ...data[key],
      }));
    } else {
      return []; // Return an empty array if no data available
    }
  } catch (error) {
    console.error("Error fetching technologies:", error);
    throw error;
  }
};
// Function to update a technology
export const putUpdateTechnology = async (id, name, description, status, imageFile) => {
  try {
    let imageUrl = null;
    if (imageFile) {
      const storageReference = storageRef(storage, `technologies/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageReference, imageFile);
      imageUrl = await getDownloadURL(storageReference);
    }

    const techRef = ref(database, `technologies/${id}`);
    await update(techRef, {
      name,
      description,
      status,
      ...(imageUrl && { imageUrl })
    });
  } catch (error) {
    console.error("Error updating technology:", error);
    throw error;
  }
};

// Function to delete a technology
export const deleteTechnology = async (id) => {
  try {
    const techRef = ref(database, `technologies/${id}`);
    await remove(techRef);
  } catch (error) {
    console.error("Error deleting technology:", error);
    throw error;
  }
};

// Function to get a technology by ID
export const getTechnologyById = async (id) => {
  try {
    console.log(`Fetching technology with ID: ${id}`); // Debug
    const techRef = ref(database, `technologies/${id}`);
    const snapshot = await get(techRef);
    console.log('Technology data:', snapshot.val()); // Debug

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No such technology!");
    }
  } catch (error) {
    console.error("Failed to fetch technology by ID:", error);
    throw error;
  }
};

const loadTechnologies = async () => {
  try {
    const data = await fetchAllTechnology();
    console.log("Fetched technologies:", data); // Debug log
    const techArray = data.map((item, index) => ({
      key: item.id, // Correctly assign the ID from Firebase as the key
      ...item,
    }));
    setTechnologies(techArray);
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
  }
};