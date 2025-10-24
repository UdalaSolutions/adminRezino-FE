import axios from 'axios';
import { BASE_URL } from '@/config';

export interface OrderLine {
	id: number;
	userId: number;
	orderLineId: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: number;
	discount: number;
}

export interface OrderLinePayload {
	userId: number;
	orderLineId: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: number;
	discount: number;
}

// Utility to get token from localStorage
const getAuthToken = (): string | null => {
	if (typeof window !== 'undefined') {
		return JSON.parse(localStorage.getItem('authToken') || '{}').token;
	}
	return null;
};

// Create a new order line
export const createOrderLine = async (
	payload: OrderLinePayload
): Promise<OrderLine> => {
	const token = getAuthToken();
	try {
		const response = await axios.post(`${BASE_URL}/api/order-lines`, payload, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (err: any) {
		console.error('Error creating order line', err);
		if (err.response?.data?.message) {
			throw new Error(err.response.data.message);
		} else if (err.request) {
			throw new Error('No response from server. Please check your connection.');
		} else {
			throw new Error('Failed to create order line. Please try again.');
		}
	}
};

// Get an order line by ID
export const getOrderLine = async (id: number): Promise<OrderLine> => {
	const token = getAuthToken();
	try {
		const response = await axios.get(`${BASE_URL}/api/order-lines/${id}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (err: any) {
		console.error('Error fetching order line', err);
		if (err.response?.data?.message) {
			throw new Error(err.response.data.message);
		} else if (err.request) {
			throw new Error('No response from server. Please check your connection.');
		} else {
			throw new Error('Failed to fetch order line. Please try again.');
		}
	}
};

// Update an order line
export const updateOrderLine = async (
	id: number,
	payload: Partial<OrderLinePayload>
): Promise<OrderLine> => {
	const token = getAuthToken();
	try {
		const response = await axios.put(
			`${BASE_URL}/api/order-lines/${id}`,
			payload,
			{ headers: token ? { Authorization: `Bearer ${token}` } : {} }
		);
		return response.data;
	} catch (err: any) {
		console.error('Error updating order line', err);
		if (err.response?.data?.message) {
			throw new Error(err.response.data.message);
		} else if (err.request) {
			throw new Error('No response from server. Please check your connection.');
		} else {
			throw new Error('Failed to update order line. Please try again.');
		}
	}
};

// Delete an order line
export const deleteOrderLine = async (id: number): Promise<void> => {
	const token = getAuthToken();
	try {
		await axios.delete(`${BASE_URL}/api/order-lines/${id}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
	} catch (err: any) {
		console.error('Error deleting order line', err);
		if (err.response?.data?.message) {
			throw new Error(err.response.data.message);
		} else if (err.request) {
			throw new Error('No response from server. Please check your connection.');
		} else {
			throw new Error('Failed to delete order line. Please try again.');
		}
	}
};

// List all order lines
export const listOrderLines = async (
	params?: Record<string, any>
): Promise<OrderLine[]> => {
	const token = getAuthToken();
	try {
		const response = await axios.get(`${BASE_URL}/api/order-lines`, {
			params,
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (err: any) {
		console.error('Error fetching order lines', err);
		if (err.response?.data?.message) {
			throw new Error(err.response.data.message);
		} else if (err.request) {
			throw new Error('No response from server. Please check your connection.');
		} else {
			throw new Error('Failed to fetch order lines. Please try again.');
		}
	}
};
