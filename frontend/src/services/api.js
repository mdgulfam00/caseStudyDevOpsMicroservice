import axios from 'axios';

const API_BASE_URL = 'http://05a3453c3a1c.mylabserver.com';

const userService = axios.create({
  baseURL: `${API_BASE_URL}:8081`,
});

const taskService = axios.create({
  baseURL: `${API_BASE_URL}:8082`,
});

const submissionService = axios.create({
  baseURL: `${API_BASE_URL}:8083`,
});

// Add token to requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userService.interceptors.request.use(addAuthToken);
taskService.interceptors.request.use(addAuthToken);
submissionService.interceptors.request.use(addAuthToken);

export const authAPI = {
  login: (credentials) => userService.post('/auth/login', credentials),
  signup: (userData) => userService.post('/auth/signup', userData),
  logout: () => userService.post('/auth/logout'),
  getProfile: () => userService.get('/users/profile'),
  getAllUsers: () => userService.get('/users/all'),
};

export const notificationAPI = {
  getUnreadNotifications: () => userService.get('/notifications'),
  getUnreadCount: () => userService.get('/notifications/count'),
  markAsRead: (id) => userService.put(`/notifications/${id}/read`),
  markAllAsRead: () => userService.put('/notifications/read-all'),
};

export const taskAPI = {
  getAllTasks: () => taskService.get('/tasks'),
  getTaskById: (id) => taskService.get(`/tasks/${id}`),
  createTask: (task) => taskService.post('/tasks', task),
  updateTask: (id, task) => taskService.put(`/tasks/${id}`, task),
  updateTaskStatus: (taskId, status) => taskService.put(`/tasks/${taskId}/status/${status}`),
  deleteTask: (id) => taskService.delete(`/tasks/${id}`),
  assignTask: (taskId, userId) => taskService.post(`/tasks/${taskId}/assign/${userId}`),
  getUserTasks: (userId) => taskService.get(`/tasks/user/${userId}`),
  completeTask: (taskId, userId) => taskService.post(`/tasks/${taskId}/complete/${userId}`),
};

export const submissionAPI = {
  submitTask: (submission) => submissionService.post('/submissions', submission),
  getAllSubmissions: () => submissionService.get('/submissions'),
  getSubmissionById: (id) => submissionService.get(`/submissions/${id}`),
  getSubmissionsByTask: (taskId) => submissionService.get(`/submissions/task/${taskId}`),
  getSubmissionsByUser: (userId) => submissionService.get(`/submissions/user/${userId}`),
  acceptSubmission: (id) => submissionService.put(`/submissions/${id}/accept`),
  rejectSubmission: (id) => submissionService.put(`/submissions/${id}/reject`),
};
