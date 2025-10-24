import axios from 'axios';
import { BASE_URL } from '@/config';

const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const tokenData = localStorage.getItem('authToken');
			const token = tokenData ? JSON.parse(tokenData).token : null;

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 403) {
			// Clear invalid auth and redirect to login
			localStorage.removeItem('authToken');
			localStorage.removeItem('userData');
			window.dispatchEvent(new Event('authChange'));

			if (typeof window !== 'undefined') {
				window.location.href =
					'/login?redirect=' + encodeURIComponent(window.location.pathname);
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
