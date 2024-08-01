// service/TechnologyServices.js
import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from "../firebaseConfig";

// Function to add a new technology
export const addTechnology = async (name, description, status, imageFile) => {
  try {
    const newTechRef = push(ref(database, 'technologies'));

    let imageURL = null;
    if (imageFile) {
      const imageName = `${Date.now()}_${imageFile.name}`;
      const imageRef = storageRef(storage, `images/${imageName}`);

      await uploadBytes(imageRef, imageFile);
      imageURL = await getDownloadURL(imageRef);
    }

    await set(newTechRef, {
      name,
      description,
      status,
      imageURL
    });
  } catch (error) {
    console.error("Error adding technology:", error);
    throw error;
  }
};

// Function to update an existing technology
export const updateTechnology = async (id, name, description, status, imageFile) => {
  try {
    const techRef = ref(database, `technologies/${id}`);
    
    let imageURL = null;
    if (imageFile) {
      const imageName = `${Date.now()}_${imageFile.name}`;
      const imageRef = storageRef(storage, `images/${imageName}`);

      await uploadBytes(imageRef, imageFile);
      imageURL = await getDownloadURL(imageRef);
    }

    await update(techRef, {
      name,
      description,
      status,
      imageURL
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
    const techRef = ref(database, `technologies/${id}`);
    const snapshot = await get(techRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching technology:", error);
    throw error;
  }
};
export const fetchAllTechnology = async () => {
  try {
    const techRef = ref(database, 'technologies');
    const snapshot = await get(techRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    console.error("Error fetching technologies:", error);
    throw error;
  }
};
export const postCreateTechnology = async (name, description, status, imageFile) => {
  // function implementation
};
