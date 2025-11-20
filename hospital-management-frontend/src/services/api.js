import axios from 'axios';
import apiConfig from '../config/api';

const api = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post(apiConfig.AUTH.LOGIN, credentials),
  register: (userData) => api.post(apiConfig.AUTH.REGISTER, userData),
  getProfile: () => api.get(apiConfig.AUTH.PROFILE),
};

// Patients API
export const patientsAPI = {
  getAll: () => api.get(apiConfig.PATIENTS),
  getById: (id) => api.get(`${apiConfig.PATIENTS}/${id}`),
  create: (patientData) => api.post(apiConfig.PATIENTS, patientData),
  update: (id, patientData) => api.put(`${apiConfig.PATIENTS}/${id}`, patientData),
  delete: (id) => api.delete(`${apiConfig.PATIENTS}/${id}`),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => api.get(apiConfig.DOCTORS),
  getById: (id) => api.get(`${apiConfig.DOCTORS}/${id}`),
  getAvailableSlots: (doctorId, date) => 
    api.get(`${apiConfig.DOCTORS}/${doctorId}/slots?date=${date}`),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => api.get(apiConfig.APPOINTMENTS),
  getById: (id) => api.get(`${apiConfig.APPOINTMENTS}/${id}`),
  create: (appointmentData) => api.post(apiConfig.APPOINTMENTS, appointmentData),
  update: (id, appointmentData) => 
    api.put(`${apiConfig.APPOINTMENTS}/${id}`, appointmentData),
  cancel: (id) => api.delete(`${apiConfig.APPOINTMENTS}/${id}`),
  getByPatient: (patientId) => 
    api.get(`${apiConfig.APPOINTMENTS}?patientId=${patientId}`),
  getByDoctor: (doctorId) => 
    api.get(`${apiConfig.APPOINTMENTS}?doctorId=${doctorId}`),
};

// Prescriptions API
export const prescriptionsAPI = {
  getByPatient: (patientId) => 
    api.get(`${apiConfig.PRESCRIPTIONS}?patientId=${patientId}`),
  create: (prescriptionData) => api.post(apiConfig.PRESCRIPTIONS, prescriptionData),
};

export default api;
