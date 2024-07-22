import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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
const auth = getAuth(app);
const database = getDatabase(app);
const addItem = () => {
  const newItem = {
    title: "New Item",
    information: "Information about new item",
    price: 100,
    company: "New Company",
    image: "/images/new_image.jpg"
  };

  database.ref('/your-data-path').push(newItem).then(() => {
    // Cập nhật lại dữ liệu sau khi thêm
    fetchData();
  });
};

// Sử dụng addItem khi nhấn nút


const deleteItem = (key) => {
  database.ref(`/your-data-path/${key}`).remove().then(() => {
    // Cập nhật lại dữ liệu sau khi xóa
    fetchData();
  });
};

// Sử dụng deleteItem trong render của Column Actions



export { auth, database };