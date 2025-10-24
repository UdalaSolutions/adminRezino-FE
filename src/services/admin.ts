import axios from 'axios';
import { BASE_URL } from '@/config';
import { Product } from '@/types/index';

export interface ProductApiPayload {
	id?: number;
	productName: string;
	productDescription: string;
	productPrice: number;
	productCategory: string;
	cartoonQuantity: number;
	imageUrl: string;
	discount: number;
	brand: string;
}

/**
 * Order interface representing one order item.
 */
export interface OrderLine {
	id: number;
	orderId: number | null;
	userId: number;
	productId: number;
	quantity: number;
	price: number;
	discountPrice: number;
	discount: number;
	dateTimeCreated: number[];
}

// Blog Post Interfaces
export interface BlogPost {
	id: number;
	adminId: number;
	title: string;
	content: string;
	imageUrl: string;
	videoUrl: string;
	dateCreated: number[];
}

export interface ApiResponse {
	data: {
		posts: BlogPost[];
	};
	successfully: boolean;
	message?: string;
}

export interface FormData {
	title: string;
	content: string;
	imageUrl: string;
	videoUrl: string;
}

/**
 * Helper to get the right token (admin or user)
 */
const getToken = (): string => {
	if (typeof window === 'undefined') return '';

	// Prefer admin token
	const adminToken = localStorage.getItem('adminAuthToken');
	if (adminToken) return adminToken;

	// Fallback to normal user token
	const userTokenData = localStorage.getItem('authToken');
	if (userTokenData) {
		try {
			const parsed = JSON.parse(userTokenData);
			return parsed?.token || '';
		} catch {
			return userTokenData;
		}
	}
	return '';
};

/**
 * Get all products for the admin.
 * @returns Array of Product objects.
 * @throws Error if fetching fails.
 */
export const getAllProducts = async (): Promise<Product[]> => {
	try {
		const token = getToken();
		const response = await axios.get(`${BASE_URL}/api/admin/product/get-all`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
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

export const addProduct = async (product: ProductApiPayload) => {
	try {
		const token = getToken();

		const response = await axios.post(
			`${BASE_URL}/api/admin/product/add`,
			product,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return response.data;
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
		throw new Error('Failed to add product');
	}
};

export const editProduct = async (product: {
	id: number;
	productName: string;
	productDescription: string;
	productPrice: number;
	productCategory: string;
	cartoonQuantity: number;
	imageUrl: string;
	discount: number;
	brand: string;
}) => {
	try {
		const token = getToken();
		const response = await axios.put(
			`${BASE_URL}/api/admin/product/update`,
			product,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
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
		throw new Error('Failed to edit product');
	}
};

/**
 * Delete a product by its ID (admin).
 * @param productId - The ID of the product to delete.
 * @returns The response data on success.
 * @throws Error if deletion fails.
 */
export const deleteProduct = async (productId: number) => {
	try {
		const token = getToken();
		const response = await axios.delete(
			`${BASE_URL}/api/admin/product/delete/${productId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (err: any) {
		console.error('There was an error', err);
		if (err.response?.data?.message) {
			throw new Error(err.response.data.message);
		}
		throw new Error('Failed to delete product');
	}
};

/**
 * Get the total number of customers for the admin.
 * @returns Number of customers.
 * @throws Error if fetching fails.
 */
export const getAllNumberOfCustomers = async (): Promise<number> => {
	try {
		const token = getToken();
		const response = await axios.get(
			`${BASE_URL}/api/admin/order/get-all-number-of-customer`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const numberOfCustomers = response.data.data ?? 0;
		console.log(numberOfCustomers);
		return numberOfCustomers;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data === 'string'
		) {
			throw new Error((err as any).response.data);
		}
		throw new Error('Failed to fetch number of customers');
	}
};

/**
 * Get the total number of customers for the admin.
 * @returns Number of customers.
 * @throws Error if fetching fails.
 */
export const getAllProductsSold = async (): Promise<number> => {
	try {
		const token = getToken();
		const response = await axios.get(
			`${BASE_URL}/api/admin/product/get-all-number-of-product-sold`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const numberOfProductsSold = response.data.data ?? 0;
		return numberOfProductsSold;
	} catch (err: unknown) {
		console.error('There was an error', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data === 'string'
		) {
			throw new Error((err as any).response.data);
		}
		throw new Error('Failed to fetch number of customers');
	}
};

/**
 * Get all orders for the admin.
 * @returns Array of order lines.
 * @throws Error if fetching fails.
 */
export const getAllOrders = async (): Promise<OrderLine[]> => {
	try {
		const token = getToken();
		const response = await axios.get(
			`${BASE_URL}/api/admin/order/get-all-order`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const orders = response.data?.data?.orderLines ?? [];
		return orders;
	} catch (err: unknown) {
		console.error('There was an error fetching all orders', err);
		throw new Error('Failed to fetch all orders');
	}
};

/**
 * Get all brands for the admin.
 * @returns Array of brand names (strings).
 * @throws Error if fetching fails.
 */
export const getAllBrands = async (): Promise<string[]> => {
	try {
		const token = getToken();
		const response = await axios.get(
			`${BASE_URL}/api/admin/product/get-all-brand-name`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const brands = response.data?.data?.brandNames || [];
		return brands;
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
		throw new Error('Failed to fetch brands');
	}
};

// Fetch all posts
export const fetchAllBlogPosts = async (): Promise<BlogPost[]> => {
	const token = getToken();
	const res = await axios.get<ApiResponse>(
		`${BASE_URL}/api/admin/post/get-all`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	if (res.data.successfully) {
		return res.data.data.posts;
	} else {
		throw new Error('Failed to fetch posts');
	}
};

// Create or update a post
export const createOrUpdateBlogPost = async (
	formData: FormData,
	mode: 'create' | 'edit',
	postId?: number
) => {
	const token = getToken();
	if (!token) throw new Error('Authentication required. Please log in again.');
	const url =
		mode === 'create'
			? `${BASE_URL}/api/admin/post/create`
			: `${BASE_URL}/api/admin/post/update/${postId}`;
	const method = mode === 'create' ? 'post' : 'put';
	const res = await axios({
		method,
		url,
		data: formData,
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// Delete a post
export const deleteBlogPost = async (postId: number) => {
	const token = getToken();
	if (!token) throw new Error('Authentication required. Please log in again.');
	const res = await axios.delete(
		`${BASE_URL}/api/admin/post/delete/${postId}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return res.data;
};
