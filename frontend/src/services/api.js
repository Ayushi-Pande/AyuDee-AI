import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});

export const apiService = {
  getHealth: () => api.get("/health"),

  getDashboardPatient: (patientId) => api.get(`/api/dashboard/patient/${patientId}`),
  getMemories: (patientId) => api.get(`/api/memories/${patientId}`),
  createMemory: (payload) => api.post("/api/memories", payload),
  updateMemory: (memoryId, payload) => api.put(`/api/memories/${memoryId}`, payload),
  deleteMemory: (memoryId) => api.delete(`/api/memories/${memoryId}`),

  getReminders: (patientId) => api.get(`/api/reminders/${patientId}`),
  createReminder: (payload) => api.post("/api/reminders", payload),
  updateReminder: (reminderId, payload) => api.put(`/api/reminders/${reminderId}`, payload),
  deleteReminder: (reminderId) => api.delete(`/api/reminders/${reminderId}`),
  updateReminderStatus: (reminderId, status) =>
    api.patch(`/api/reminders/${reminderId}/status`, { status }),

  createGameResult: (payload) => api.post("/api/game-results", payload),
  getGameResults: (patientId) => api.get(`/api/game-results/${patientId}`),

  postChat: (payload) => api.post("/api/chat", payload),

  getAnalytics: (patientId) => api.get(`/api/analytics/${patientId}`),
  getActivities: (patientId) => api.get(`/api/activities/${patientId}`),
  createActivity: (payload) => api.post("/api/activities", payload),
};

export default api;
