import axios from "axios";

const fetchAllTechnology = (page) => {
    return axios.get('/api/technologies?page=${page}');
}

const postCreateTechnology = (name, description, status) => {
    return axios.post("/api/technologies", { name, description, status })
}

const putUpdateTechnology = (name, description, status) => {
    return axios.put("/api/technologies", { name, description, status })
}

export { fetchAllTechnology, postCreateTechnolog, putUpdateTechnologyy };