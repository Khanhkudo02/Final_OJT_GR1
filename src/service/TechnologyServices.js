import axios from 'axios';

// Fetch all technologies with pagination
const fetchAllTechnology = (page) => {
    return axios.get(`/api/technologies?page=${page}`);
}

// Create a new technology
const postCreateTechnology = (name, description, status) => {
    return axios.post("/api/technologies", { name, description, status });
}

// Update an existing technology
const putUpdateTechnology = (id, name, description, status) => {
    return axios.put(`/api/technologies/${id}`, { name, description, status });
}

export { fetchAllTechnology, postCreateTechnology, putUpdateTechnology };
