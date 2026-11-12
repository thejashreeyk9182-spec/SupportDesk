
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Centralized response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      error.message = error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : "Network error. Please check your connection.";
    } else {
      switch (error.response.status) {
        case 400:
          error.message = "Bad request.";
          break;
        case 401:
          error.message = "Unauthorized. Please log in again.";
          break;
        case 403:
          error.message = "You do not have permission.";
          break;
        case 404:
          error.message = "Requested resource not found.";
          break;
        case 500:
          error.message = "Internal server error.";
          break;
        default:
          error.message = "Something went wrong.";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
