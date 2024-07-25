import { ref, set, push, update, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from '../firebaseConfig';

const db = database;
const storageInstance = storage;

// Create new project
const postCreateProject = async (projectData, imageFile) => {
    try {
        const newProjectRef = push(ref(db, 'projects'));

        let imageUrl = null;
        if (imageFile) {
            // Upload the image to Firebase Storage
            const imageRef = storageRef(storageInstance, `images/${newProjectRef.key}/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        await set(newProjectRef, {
            ...projectData,
            imageUrl,
        });

        return newProjectRef.key;
    } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
    }
};

// Fetch all projects
const fetchAllProjects = async () => {
    try {
        const projectsRef = ref(db, 'projects');
        const snapshot = await get(projectsRef);
        const data = snapshot.val();
        return data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        throw error;
    }
};

// Update existing project
const putUpdateProject = async (id, projectData, imageFile) => {
    try {
        const projectRef = ref(db, `projects/${id}`);

        let imageUrl = null;
        if (imageFile) {
            const imageRef = storageRef(storageInstance, `images/${id}/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        await update(projectRef, {
            ...projectData,
            imageUrl: imageUrl || projectData.imageUrl,
        });

        return id;
    } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
    }
};

// Delete project
const deleteProject = async (id) => {
    try {
        const projectRef = ref(db, `projects/${id}`);
        const projectSnapshot = await get(projectRef);

        // Delete image from Firebase Storage
        const imageUrl = projectSnapshot.val()?.imageUrl;
        if (imageUrl) {
            const imageName = imageUrl.split('/').pop().split('?')[0]; // Extract file name from URL
            const imageRef = storageRef(storageInstance, `images/${id}/${imageName}`);
            await deleteObject(imageRef);
        }

        // Delete project from Realtime Database
        await remove(projectRef);
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw error;
    }
};

export { fetchAllProjects, postCreateProject, putUpdateProject, deleteProject };
