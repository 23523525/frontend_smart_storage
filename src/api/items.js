import { api } from "./axiosInstance";

export const ItemsApi = {
    getAll: () => api.get("/items"),
    getById: (id) => api.get(`/items/${id}`),
    create: (data) => api.post("/items", data),
    update: (id, data) => api.put(`/items/${id}`, data),
    delete: (id) => api.delete(`/items/${id}`),
    search: (q) => api.get(`/items/search?q=${q}`),
    getByCategory: (categoryId) => api.get(`/items/by-category/${categoryId}`),
    getQr: (id) => api.get(`/items/qr/${id}`),
};