import axios from 'axios';
import { BASE_URL } from '@/config';
import { Product } from '@/types/index';

let productCache: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

// This function will fetch, cache, and return products
export const getAllProducts = async (): Promise<Product[]> => {
	// Return cache if already fetched
	if (productCache) return productCache;

	// Avoid duplicate fetches if multiple components call this at once
	if (fetchPromise) return fetchPromise;

	fetchPromise = axios
		.get(`${BASE_URL}/api/product/get-all-product`, {
			headers: { 'Content-Type': 'application/json' },
		})
		.then((response) => {
			productCache = response.data?.data?.products || [];
			fetchPromise = null;
			return productCache;
		})
		.catch((err) => {
			fetchPromise = null;
			throw new Error(
				err?.response?.data?.message || 'Failed to fetch products'
			);
		});

	return fetchPromise;
};

// Optionally, provide a way to clear the cache (e.g., after product update)
export const clearProductCache = () => {
	productCache = null;
	fetchPromise = null;
};
