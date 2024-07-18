import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "../../firebaseConfig";

export const signUp = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await set(ref(database, "users/" + user.uid), {
      email: email,
      role: role,
    });
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const snapshot = await get(ref(database, "users/" + user.uid));
    const userData = snapshot.val();
    console.log("user", user);
    console.log("userData", userData);
    return { user, userData };
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

export const updateUserRole = async (uid, role) => {
  try {
    await update(ref(database, "users/" + uid), { role: role });
    console.log(`User ${uid} role updated to ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    throw error;
  }
};
