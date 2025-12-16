import { api } from "./axiosInstance";

export const MovementsApi = {
    getAll: () => api.get("/movements"),
    getByItemId: (itemId) => api.get(`/movements/by-item/${itemId}`),
    addStock: (itemId, data) => api.post(`/movements/add-stock/${itemId}`, data),
    removeStock: (itemId, data) => api.post(`/movements/remove-stock/${itemId}`, data),
};