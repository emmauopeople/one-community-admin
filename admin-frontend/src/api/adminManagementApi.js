import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

export async function getAdmins() {
  const response = await axios.get(`${API_BASE_URL}/admins`, {
    withCredentials: true,
  });

  return response.data;
}
export async function createAdmin(payload) {
  const response = await axios.post(`${API_BASE_URL}/admins`, payload, {
    withCredentials: true,
  });

  return response.data;
}
