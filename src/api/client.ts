import { User } from "../apis/User";
import { Log } from "../apis/Log";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const userApi = new User({
  baseUrl: API_BASE_URL,
  securityWorker: () => {
    const token = useAuthStore.getState().token;
    if (token) {
      return { headers: { TOKEN: token } };
    }
    return {};
  },
});

export const logApi = new Log({
  baseUrl: API_BASE_URL,
  securityWorker: () => {
    const token = useAuthStore.getState().token;
    if (token) {
      return { headers: { TOKEN: token } };
    }
    return {};
  },
});
