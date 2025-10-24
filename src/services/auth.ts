import axios from 'axios';
import { BASE_URL } from '@/config';

// ============ TYPES ============
export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	city: string;
	state: string;
	country: string;
	dateCreated: number[];
	isVerified?: boolean;
	imageUrl?: string | null;
}

export interface AuthTokens {
	token: string;
	refreshToken?: string;
	expiresAt?: number;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface SignupData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phoneNumber: string;
	address: string;
	city: string;
	state: string;
	country: string;
}

export interface EmailVerificationData {
	email: string;
	otp?: string;
}

export interface ApiResponse<T = any> {
	data: T;
	successfully: boolean;
	message?: string;
}

export interface LoginResponseData extends User {
	message: string;
	token: string;
}

export interface AuthStorage {
	tokens: AuthTokens;
	user: User;
	timestamp: number;
}

// ============ CONSTANTS ============
const AUTH_KEYS = {
	TOKENS: 'authTokens',
	USER: 'userData',
	TIMESTAMP: 'authTimestamp',
} as const;

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

// ============ ERROR CLASSES ============
export class AuthError extends Error {
	constructor(message: string, public code?: string, public status?: number) {
		super(message);
		this.name = 'AuthError';
	}
}

export class NetworkError extends AuthError {
	constructor(message: string = 'Network error occurred') {
		super(message, 'NETWORK_ERROR');
		this.name = 'NetworkError';
	}
}

export class ValidationError extends AuthError {
	constructor(message: string = 'Validation failed') {
		super(message, 'VALIDATION_ERROR');
		this.name = 'ValidationError';
	}
}

// ============ STORAGE MANAGER ============
class StorageManager {
	private static instance: StorageManager;

	static getInstance(): StorageManager {
		if (!StorageManager.instance) {
			StorageManager.instance = new StorageManager();
		}
		return StorageManager.instance;
	}

	set<T>(key: string, value: T): void {
		try {
			if (typeof window === 'undefined') return;
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Failed to set ${key} in storage:`, error);
			throw new AuthError('Storage operation failed');
		}
	}

	get<T>(key: string): T | null {
		try {
			if (typeof window === 'undefined') return null;
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.error(`Failed to get ${key} from storage:`, error);
			this.remove(key);
			return null;
		}
	}

	remove(key: string): void {
		try {
			if (typeof window === 'undefined') return;
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Failed to remove ${key} from storage:`, error);
		}
	}

	clear(): void {
		try {
			if (typeof window === 'undefined') return;
			Object.values(AUTH_KEYS).forEach((key) => this.remove(key));
		} catch (error) {
			console.error('Failed to clear storage:', error);
		}
	}
}

// ============ AUTH SERVICE ============
class AuthService {
	private static instance: AuthService;
	private storage: StorageManager;
	private isRefreshing = false;
	private refreshPromise: Promise<AuthTokens | null> | null = null;

	private constructor() {
		this.storage = StorageManager.getInstance();
		this.setupAxiosInterceptors();
	}

	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	// ============ PUBLIC API ============
	async login(
		credentials: LoginCredentials
	): Promise<ApiResponse<LoginResponseData>> {
		try {
			this.validateCredentials(credentials);

			const response = await axios.post<ApiResponse<LoginResponseData>>(
				`${BASE_URL}/api/user/login`,
				credentials
			);

			if (response.data.successfully && response.data.data.token) {
				await this.setAuthData({
					tokens: { token: response.data.data.token },
					user: response.data.data,
					timestamp: Date.now(),
				});
			}

			return response.data;
		} catch (error: any) {
			throw this.handleError(error, 'Login failed');
		}
	}

	async adminLogin(
		credentials: LoginCredentials
	): Promise<ApiResponse<LoginResponseData>> {
		try {
			this.validateCredentials(credentials);

			const response = await axios.post<ApiResponse<LoginResponseData>>(
				`${BASE_URL}/api/admin/loginAdmin`,
				credentials
			);

			if (response.data.successfully && response.data.data.token) {
				await this.setAuthData({
					tokens: { token: response.data.data.token },
					user: response.data.data,
					timestamp: Date.now(),
				});
			}

			return response.data;
		} catch (error: any) {
			throw this.handleError(error, 'Admin login failed');
		}
	}

	async signup(userData: SignupData): Promise<ApiResponse> {
		try {
			this.validateSignupData(userData);

			const response = await axios.post<ApiResponse>(
				`${BASE_URL}/api/user/register`,
				userData
			);

			return response.data;
		} catch (error: any) {
			throw this.handleError(error, 'Signup failed');
		}
	}

	async adminSignup(data: {
		firstName: string;
		lastName: string;
		userName: string;
		email: string;
		password: string;
	}): Promise<ApiResponse> {
		try {
			if (
				!data.firstName ||
				!data.lastName ||
				!data.userName ||
				!data.email ||
				!data.password
			) {
				throw new ValidationError('All fields are required');
			}

			if (!/\S+@\S+\.\S+/.test(data.email)) {
				throw new ValidationError('Please enter a valid email address');
			}

			if (data.password.length < 6) {
				throw new ValidationError(
					'Password must be at least 6 characters long'
				);
			}

			const response = await axios.post<ApiResponse>(
				`${BASE_URL}/api/admin/createAdmin`,
				data
			);

			return response.data;
		} catch (error: any) {
			throw this.handleError(error, 'Admin signup failed');
		}
	}

	async sendVerificationEmail(
		data: EmailVerificationData
	): Promise<ApiResponse> {
		try {
			if (!data.email) {
				throw new ValidationError('Email is required');
			}

			const response = await axios.post<ApiResponse>(
				`${BASE_URL}/api/admin/send-verification-email-admin`,
				data
			);

			return response.data;
		} catch (error: any) {
			throw this.handleError(error, 'Failed to send verification email');
		}
	}

	async verifyEmail(data: EmailVerificationData): Promise<ApiResponse> {
		try {
			if (!data.email || !data.otp) {
				throw new ValidationError('Email and OTP are required');
			}

			const response = await axios.post<ApiResponse>(
				`${BASE_URL}/api/admin/verify-email-admin`,
				data
			);

			return response.data;
		} catch (error: any) {
			throw this.handleError(error, 'Email verification failed');
		}
	}

	async logout(): Promise<void> {
		try {
			// Optional: Call logout endpoint if needed
			// await axios.post(`${BASE_URL}/api/user/logout`, {}, {
			//   headers: this.getAuthHeaders()
			// });
		} catch (error) {
			console.error('Logout API call failed:', error);
		} finally {
			this.clearAuthData();
		}
	}

	// ============ AUTH STATE MANAGEMENT ============
	isAuthenticated(): boolean {
		const tokens = this.getTokens();
		return !!(tokens?.token && !this.isTokenExpired(tokens));
	}

	getCurrentUser(): User | null {
		return this.storage.get<User>(AUTH_KEYS.USER);
	}

	getTokens(): AuthTokens | null {
		return this.storage.get<AuthTokens>(AUTH_KEYS.TOKENS);
	}

	async refreshTokens(): Promise<AuthTokens | null> {
		if (this.isRefreshing && this.refreshPromise) {
			return this.refreshPromise;
		}

		this.isRefreshing = true;
		this.refreshPromise = this.performTokenRefresh();

		try {
			const tokens = await this.refreshPromise;
			return tokens;
		} finally {
			this.isRefreshing = false;
			this.refreshPromise = null;
		}
	}

	// ============ PRIVATE METHODS ============
	private async setAuthData(authData: AuthStorage): Promise<void> {
		this.storage.set(AUTH_KEYS.TOKENS, authData.tokens);
		this.storage.set(AUTH_KEYS.USER, authData.user);
		this.storage.set(AUTH_KEYS.TIMESTAMP, authData.timestamp);

		// Notify other tabs/components
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('authChange'));
		}
	}

	private clearAuthData(): void {
		this.storage.clear();

		// Notify other tabs/components
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('authChange'));
		}
	}

	private isTokenExpired(tokens: AuthTokens): boolean {
		if (!tokens.expiresAt) return false;
		return Date.now() >= tokens.expiresAt - TOKEN_REFRESH_THRESHOLD;
	}

	private async performTokenRefresh(): Promise<AuthTokens | null> {
		try {
			// Implement token refresh logic if your backend supports it
			// const response = await axios.post(`${BASE_URL}/api/user/refresh-token`, {
			//   refreshToken: this.getTokens()?.refreshToken
			// });

			// const newTokens = response.data.tokens;
			// await this.setAuthData({
			//   tokens: newTokens,
			//   user: this.getCurrentUser()!,
			//   timestamp: Date.now()
			// });

			// return newTokens;
			return this.getTokens();
		} catch (error) {
			this.clearAuthData();
			return null;
		}
	}

	private getAuthHeaders(): Record<string, string> {
		const tokens = this.getTokens();
		return {
			'Content-Type': 'application/json',
			...(tokens?.token && { Authorization: `Bearer ${tokens.token}` }),
		};
	}

	private setupAxiosInterceptors(): void {
		// Request interceptor
		axios.interceptors.request.use(
			async (config) => {
				const tokens = this.getTokens();

				if (tokens?.token && config.url?.includes(BASE_URL)) {
					// Check if token needs refresh
					if (this.isTokenExpired(tokens)) {
						const newTokens = await this.refreshTokens();
						if (newTokens?.token) {
							config.headers.Authorization = `Bearer ${newTokens.token}`;
						}
					} else {
						config.headers.Authorization = `Bearer ${tokens.token}`;
					}
				}

				return config;
			},
			(error) => Promise.reject(error)
		);

		// Response interceptor
		axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response?.status === 401) {
					this.clearAuthData();

					// Redirect to login if not already there
					if (
						typeof window !== 'undefined' &&
						!window.location.pathname.includes('/login')
					) {
						window.location.href =
							'/login?redirect=' + encodeURIComponent(window.location.pathname);
					}
				}

				return Promise.reject(error);
			}
		);
	}

	// ============ VALIDATION METHODS ============
	private validateCredentials(credentials: LoginCredentials): void {
		if (!credentials.email?.trim()) {
			throw new ValidationError('Email is required');
		}

		if (!credentials.password) {
			throw new ValidationError('Password is required');
		}

		if (!/\S+@\S+\.\S+/.test(credentials.email)) {
			throw new ValidationError('Please enter a valid email address');
		}

		if (credentials.password.length < 6) {
			throw new ValidationError('Password must be at least 6 characters long');
		}
	}

	private validateSignupData(userData: SignupData): void {
		const requiredFields: (keyof SignupData)[] = [
			'firstName',
			'lastName',
			'email',
			'password',
			'phoneNumber',
		];

		for (const field of requiredFields) {
			if (!userData[field]?.toString().trim()) {
				throw new ValidationError(
					`${field.charAt(0).toUpperCase() + field.slice(1)} is required`
				);
			}
		}

		if (!/\S+@\S+\.\S+/.test(userData.email)) {
			throw new ValidationError('Please enter a valid email address');
		}

		if (userData.password.length < 6) {
			throw new ValidationError('Password must be at least 6 characters long');
		}
	}

	// ============ ERROR HANDLING ============
	private handleError(error: any, defaultMessage: string): AuthError {
		console.error('Auth service error:', error);

		if (error instanceof AuthError) {
			return error;
		}

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message =
				error.response?.data?.message || error.response?.data?.data;

			switch (status) {
				case 400:
					return new ValidationError(message || 'Invalid request data');
				case 401:
					return new AuthError(
						'Invalid credentials',
						'INVALID_CREDENTIALS',
						status
					);
				case 403:
					return new AuthError('Access denied', 'ACCESS_DENIED', status);
				case 404:
					return new AuthError(
						'Service not found',
						'SERVICE_NOT_FOUND',
						status
					);
				case 409:
					return new AuthError(
						message || 'User already exists',
						'USER_EXISTS',
						status
					);
				case 429:
					return new AuthError(
						'Too many attempts. Please try again later.',
						'RATE_LIMITED',
						status
					);
				case 500:
					return new AuthError(
						'Server error. Please try again later.',
						'SERVER_ERROR',
						status
					);
				default:
					if (error.code === 'NETWORK_ERROR' || error.request) {
						return new NetworkError(
							'No response from server. Please check your connection.'
						);
					}
					return new AuthError(message || defaultMessage, 'API_ERROR', status);
			}
		}

		return new AuthError(defaultMessage);
	}
}

// ============ EXPORT SINGLETON INSTANCE ============
export const authService = AuthService.getInstance();

// ============ LEGACY COMPATIBILITY EXPORTS ============
/**
 * @deprecated Use authService.login() instead
 */
export const Login = authService.login.bind(authService);

/**
 * @deprecated Use authService.adminLogin() instead
 */
export const AdminLogin = authService.adminLogin.bind(authService);

/**
 * @deprecated Use authService.signup() instead
 */
export const SignupService = authService.signup.bind(authService);

export const adminSignup = authService.adminSignup.bind(authService);

/**
 * @deprecated Use authService.sendVerificationEmail() instead
 */
export const SendVerificationEmail =
	authService.sendVerificationEmail.bind(authService);

/**
 * @deprecated Use authService.verifyEmail() instead
 */
export const VerifyEmail = authService.verifyEmail.bind(authService);

export default authService;
