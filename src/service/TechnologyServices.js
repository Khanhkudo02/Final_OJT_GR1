// import { ref, set, push, update, get, remove } from "firebase/database";
// import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import { database, storage } from "../firebaseConfig";

// // Function to create a technology
// export const postCreateTechnology = async (name, description, status, imageUrl) => {
//   try {
//     const newTechRef = push(ref(database, 'technologies')); // Generate a new key in the 'technologies' node
//     await set(newTechRef, {
//       name,
//       description,
//       status,
//       imageUrl,
//     });
//     return newTechRef.key; // Return the generated key
//   } catch (error) {
//     console.error("Error creating technology:", error);
//     throw error;
//   }
// };

// // Function to fetch a technology by ID
// export const fetchTechnologyById = async (id) => {
//   try {
//     const technologyRef = ref(database, `technologies/${id}`);
//     const snapshot = await get(technologyRef);

//     if (!snapshot.exists()) {
//       throw new Error("Technology not found.");
//     }

//     return snapshot.val();
//   } catch (error) {
//     console.error("Error fetching technology:", error);
//     throw error;
//   }
// };

// // Function to fetch all technologies
// export const fetchAllTechnology = async () => {
//   try {
//     const techRef = ref(database, 'technologies');
//     const snapshot = await get(techRef);
//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       return Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching technologies:", error);
//     throw error;
//   }
// };

// // Function to update a technology
// export const putUpdateTechnology = async (id, name, description, status, imageFile) => {
//   try {
//     let imageUrl = null;
//     if (imageFile) {
//       const storageReference = storageRef(storage, `technologies/${Date.now()}_${imageFile.name}`);
//       await uploadBytes(storageReference, imageFile);
//       imageUrl = await getDownloadURL(storageReference);
//     }

//     const techRef = ref(database, `technologies/${id}`);
//     await update(techRef, {
//       name,
//       description,
//       status,
//       ...(imageUrl && { imageUrl }),
//     });
//   } catch (error) {
//     console.error("Error updating technology:", error);
//     throw error;
//   }
// };

// // Function to delete a technology
// export const deleteTechnology = async (id) => {
//   try {
//     const techRef = ref(database, `technologies/${id}`);
//     await remove(techRef);
//   } catch (error) {
//     console.error("Error deleting technology:", error);
//     throw error;
//   }
// };
import { get, push, ref, remove, set, update } from "firebase/database";
import { database } from "../firebaseConfig";

// Function to create a technology
export const postCreateTechnology = async (
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

// Function to fetch all technologies
export const fetchAllTechnology = async () => {
  try {
    const techRef = ref(database, "technologies");
    const snapshot = await get(techRef)
      const data = snapshot.val();
      return data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
    } catch (error) {
        console.error("Failed to fetch technologies :", error);
        throw error;
    }
};
// Function to update a technology
export const putUpdateTechnology = async (
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
export const deleteTechnology = async (id) => {
  try {
    const techRef = ref(database, `technologies/${id}`);
    await remove(techRef);
  } catch (error) {
    console.error("Error deleting technology:", error);
    throw error;
  }
};