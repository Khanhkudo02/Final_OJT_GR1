import { ref, set, push, update, get, remove } from "firebase/database";
import { database } from '../firebaseConfig';

const db = database;

// Create new language
const postCreateLanguage = async (name, description, status) => {
    try {
        const newLanguageRef = push(ref(db, 'languages'));

        await set(newLanguageRef, {
            name,
            description,
            status,
        });

        return newLanguageRef.key;
    } catch (error) {
        console.error("Failed to create language:", error);
        throw error;
    }
};

// Fetch all languages
const fetchAllLanguages = async () => {
    try {
        const languagesRef = ref(db, 'languages');
        const snapshot = await get(languagesRef);
        const data = snapshot.val();
        return data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
    } catch (error) {
        console.error("Failed to fetch languages:", error);
        throw error;
    }
};

// Update existing language
const putUpdateLanguage = async (id, name, description, status) => {
    try {
        const languageRef = ref(db, `languages/${id}`);

        await update(languageRef, {
            name,
            description,
            status,
        });

        return id;
    } catch (error) {
        console.error("Failed to update language:", error);
        throw error;
    }
};

// Delete language
const deleteLanguageById = async (id) => {
    try {
        const languageRef = ref(db, `languages/${id}`);
        await remove(languageRef);
    } catch (error) {
        console.error("Failed to delete language:", error);
        throw error;
    }
};

// Fetch language by ID
const fetchLanguageById = async (id) => {
    try {
        console.log(`Fetching language with ID: ${id}`);
        const languageRef = ref(database, `languages/${id}`);
        const snapshot = await get(languageRef);
        console.log('Language data:', snapshot.val());
        return snapshot.val();
    } catch (error) {
        console.error("Failed to fetch language by ID:", error);
        throw error;
    }
};

export { fetchAllLanguages, postCreateLanguage, putUpdateLanguage, deleteLanguageById, fetchLanguageById };
