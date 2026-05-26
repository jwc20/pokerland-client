import { User } from "../apis/User";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const userApi = new User({
  baseUrl: API_BASE_URL,
  securityWorker: () => {
    const token = useAuthStore.getState().token;
    if (token) {
      return { headers: { Authorization: `Token ${token}` } };
    }
    return {};
  },
});
