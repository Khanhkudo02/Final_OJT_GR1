import { ref, set, push, update, get, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebaseConfig";

const db = database;
const storageInstance = storage;

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const postCreateProject = async (projectData, imageFile) => {
  try {
    const newProjectRef = push(ref(db, "projects"));
    const randomId = generateRandomId();

    let imageUrl = null;
    if (imageFile) {
      const imageRef = storageRef(
        storageInstance,
        `images/${newProjectRef.key}/${imageFile.name}`
      );
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    await set(newProjectRef, {
      ...projectData,
      imageUrl,
      randomId,
    });

    return newProjectRef.key;
  } catch (error) {
    console.error("Failed to create project:", error);
    throw error;
  }
};

const fetchAllProjects = async () => {
  try {
    const projectsRef = ref(db, "projects");
    const snapshot = await get(projectsRef);
    const data = snapshot.val();
    return data
      ? Object.entries(data).map(([key, value]) => ({ key, ...value }))
      : [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
};

// Other functions remain unchanged...

export { fetchAllProjects, postCreateProject, putUpdateProject, deleteProject };