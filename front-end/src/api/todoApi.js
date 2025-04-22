import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/todos";

export const getTodos = () => axios.get(`${API_URL}/`);
export const createTodo = (data) => axios.post(API_URL, data);
export const updateTodo = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`);
