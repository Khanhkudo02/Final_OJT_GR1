

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAwAWQ93FKS0AT7i0otQ0zOTnw88bwbf7E",
  authDomain: "final-project-amit-77a68.firebaseapp.com",
  databaseURL: "https://final-project-amit-77a68-default-rtdb.firebaseio.com/",
  projectId: "final-project-amit-77a68",
  storageBucket: "final-project-amit-77a68.appspot.com",
  messagingSenderId: "906043598453",
  appId: "1:906043598453:web:149c0f9be031d622c1ba3c",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
export default app;

