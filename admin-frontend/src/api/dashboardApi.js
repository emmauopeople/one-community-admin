import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

export async function getDashboardSummary() {
  const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
    withCredentials: true,
  });

  return response.data;
}
