import axios from 'axios';
import { BASE_URL } from '@/config';

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

export const createOrderLine = async ({
	userId,
	productId,
	quantity,
	totalPrice,
	discount = 0,
}: {
	userId: number;
	productId: number;
	quantity: number;
	totalPrice: number;
	discount?: number;
}) => {
	const token = getToken();
	const response = await axios.post(
		`${BASE_URL}/api/user/create-order-line`,
		{ userId, productId, quantity, totalPrice, discount },
		{
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
		}
	);
	return response.data?.data?.id;
};

export const initializePaystackPayment = async ({
	email,
	userId,
	orderLineIds,
	amount,
}: {
	email: string;
	userId: number;
	orderLineIds: number[];
	amount: number;
}) => {
	const token = getToken();
	const response = await axios.post(
		`${BASE_URL}/api/paystack/initialize`,
		{ email, userId, orderLineIds, amount },
		{
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
		}
	);
	return response.data;
};

export const verifyPaystackPayment = async (reference: string) => {
	const token = getToken();
	const response = await axios.get(
		`${BASE_URL}/api/paystack/verify/${reference}`,
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
 * Fetch order lines by user ID.
 * @param userId - The user ID whose order lines you want to fetch.
 * @returns Array of order line objects.
 */
export const getOrderLinesByUser = async (userId: number) => {
	const token = getToken();
	const response = await axios.get(
		`${BASE_URL}/api/user/get-order-lines-by-user/${userId}`,
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
 * Fetch order lines by user ID.
 * @param userId - The user ID whose order lines you want to fetch.
 * @returns Array of order line objects.
 */
export const getProductById = async (Id: number) => {
	const token = getToken();
	const response = await axios.get(
		`${BASE_URL}/api/product/get-product/${Id}`,
		{
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
		}
	);
	return response.data;
};
