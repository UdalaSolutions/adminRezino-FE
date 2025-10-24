import axios from 'axios';
import { BASE_URL } from '@/config';
import { Product } from '@/types/index';
import { uploadImageToCloudinary } from '@/cloudinaryUpload';

const getToken = (): string | null => {
	if (typeof window !== 'undefined') {
		const userDataString = localStorage.getItem('userData');
		if (userDataString) {
			const userData = JSON.parse(userDataString);
			return userData?.token || null;
		}
	}
	return null;
};

export interface UpdateProfilePayload {
	id: number;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	city: string;
	state: string;
	country: string;
	addresses: string[];
}

/**
 * Get all products for the user.
 * @returns Array of Product objects.
 * @throws Error if fetching fails.
 */
export const getAllProducts = async (): Promise<Product[]> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/product/get-all-product`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const products = response.data?.data?.products || [];
		return products;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to fetch products');
	}
};

/**
 * Get products by exact price.
 * @param price - The price to filter products by.
 * @returns Array of Product objects.
 * @throws Error if fetching fails.
 */
export const getProductsByPrice = async (price: number): Promise<Product[]> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/product/get-all-product-price/${price}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const products = response.data?.data?.products || [];
		return products;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to fetch products by price');
	}
};

/**
 * Get products by price range.
 * @param min - Minimum price.
 * @param max - Maximum price.
 * @returns Array of Product objects.
 * @throws Error if fetching fails.
 */
export const getProductsByRange = async (
	min: number,
	max: number
): Promise<Product[]> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/product/get-by-range?min=${min}&max=${max}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const products = response.data?.data?.products || [];
		return products;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to fetch products by range');
	}
};

/**
 * Get products by category.
 * @param category - The category to filter products by.
 * @returns Array of Product objects.
 * @throws Error if fetching fails.
 */
export const getProductsByCategory = async (
	category: string
): Promise<Product[]> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/product/get-by-category?category=${encodeURIComponent(
				category
			)}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const products = response.data?.data?.products || [];
		return products;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to fetch products by category');
	}
};

/**
 * Get products by brand.
 * @param brand - The brand to filter products by.
 * @returns Array of Product objects.
 * @throws Error if fetching fails.
 */
export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/product/get-by-brand?brand=${encodeURIComponent(brand)}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const products = response.data?.data?.products || [];
		return products;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to fetch products by brand');
	}
};

/**
 * Get payment history for the current user.
 * Retrieves the user ID from localStorage and fetches payment history using that ID.
 * @returns Payment history array.
 * @throws Error if fetching fails or user ID is missing.
 */
//
export const getPaymentHistoryByUserId = async (): Promise<any[]> => {
	try {
		const userDataString = localStorage.getItem('userData');
		if (!userDataString) {
			console.warn('User data not found in localStorage');
			return [];
		}

		const userData = JSON.parse(userDataString);
		const userId = userData?.id;
		const token = userData?.token;

		if (!userId || !token) {
			console.warn('User ID or token not found.');
			return [];
		}

		const response = await axios.get(
			`${BASE_URL}/api/user/payment/get-payment-history-by-user-id/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const transactions = response.data?.data?.getAllTransaction || [];
		return transactions;
	} catch (err: unknown) {
		console.error('Error fetching payment history:', err);
		return [];
	}
};

export const updateUserProfile = async (data: UpdateProfilePayload) => {
	const token = getToken();
	const response = await axios.put(
		`${BASE_URL}/api/user/update-profile`,
		data,
		{
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
		}
	);
	return response.data;
};

/**
 * Get user profile (including addresses) by user ID.
 */
export const getUserProfileById = async (userId: number) => {
	const token = getToken();
	const response = await axios.get(`${BASE_URL}/api/user/get-user/${userId}`, {
		headers: {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }),
		},
	});
	return response.data?.data; // user profile object with addresses array
};

/**
 * Update user addresses.
 */
export const updateUserAddresses = async (
	userId: number,
	addresses: string[]
) => {
	const token = getToken();
	const response = await axios.put(
		`${BASE_URL}/api/user/update-address`,
		{ userId, addresses },
		{
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
		}
	);
	return response.data;
};

/**
 * Update user profile picture.
 * Uploads the image to Cloudinary, then sends the image URL to backend.
 */
export const updateUserProfilePicture = async (userId: number, file: File) => {
	try {
		// Step 1: Upload to Cloudinary
		const imageUrl = await uploadImageToCloudinary(file);

		// Step 2: Send the Cloudinary URL to backend
		const token = getToken();
		const response = await axios.put(
			`${BASE_URL}/api/user/update-profile-picture`,
			{ id: userId, imageUrl },
			{
				headers: {
					'Content-Type': 'application/json',
					...(token && { Authorization: `Bearer ${token}` }),
				},
			}
		);

		return response.data;
	} catch (error: any) {
		console.error('Error updating profile picture:', error);
		throw new Error(
			error.response?.data?.message || 'Failed to update profile picture'
		);
	}
};
