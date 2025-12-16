import { api } from "./axiosInstance";

export const QrApi = {
    handle: (qrCode) => api.post("/qr", { qrCode }),
};
