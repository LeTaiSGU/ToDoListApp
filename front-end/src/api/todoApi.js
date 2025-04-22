import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/todos";

export const getTodos = () => axios.get(`${API_URL}/`);

export const createTodo = (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("completed", data.completed || false);
  if (data.image) formData.append("image", data.image);

  return axios.post(API_URL + "/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateTodo = (id, data) => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.completed !== undefined)
    formData.append("completed", data.completed);

  // Handle image explicitly - if null, it means remove image
  if (data.image === null) {
    formData.append("remove_image", "true");
  } else if (data.image) {
    formData.append("image", data.image);
  }

  return axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`);
