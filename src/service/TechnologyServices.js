// service/TechnologyServices.js
import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from "../firebaseConfig";


export const postCreateTechnology = async (name, description, category, status, imageFile) => {
  try {
    const newTechnologyRef = push(ref(db, 'technologies'));

    let imageUrl = null;
    if (imageFile) {
      // Upload the image to Firebase Storage
      const imageRef = storageRef(storageInstance, `images/${newTechnologyRef.key}/${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    await set(newTechnologyRef, {
      name,
      description,
      category,
      status,
      imageUrl,
    });

    return newTechnologyRef.key;
  } catch (error) {
    console.error("Failed to create technology:", error);
    throw error;
  }
};
export const fetchTechnologyById = async (id) => {
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

export const fetchAllTechnology = async () => {
  try {
    const technologiesRef = ref(db, "technologies");
    const snapshot = await get(technologiesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        key,  // Add the key as the ID
        ...data[key],  // Spread the data
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
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






