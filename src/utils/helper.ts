import { getAllProducts } from '@/services/user';

// Helper function to format price with commas
export const formatPrice = (price: number | string) => {
	return Number(price).toLocaleString();
};

export const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
	return password.length >= 8;
};

export interface Brand {
	name: string;
	productCount: number;
}

export interface Category {
	name: string;
	productCount: number;
	slug: string;
}

// Cache for brands to avoid refetching
let brandsCache: Brand[] | null = null;

export const getAllBrands = async (): Promise<Brand[]> => {
	// Return cached brands if available
	if (brandsCache) {
		return brandsCache;
	}

	try {
		const products = await getAllProducts();

		// Extract unique brands and count products per brand
		const brandMap = new Map<string, number>();

		products.forEach((product: any) => {
			const brandName = product.brand;
			brandMap.set(brandName, (brandMap.get(brandName) || 0) + 1);
		});

		// Convert map to array of Brand objects
		const brands = Array.from(brandMap.entries()).map(
			([name, productCount]) => ({
				name,
				productCount,
			})
		);

		// Sort alphabetically
		brands.sort((a, b) => a.name.localeCompare(b.name));

		// Cache the result
		brandsCache = brands;

		return brands;
	} catch (error) {
		console.error('Error fetching brands:', error);
		return [];
	}
};

// Cache for categories to avoid refetching
let categoriesCache: Category[] | null = null;

export const getAllCategories = async (): Promise<Category[]> => {
	// Return cached categories if available
	if (categoriesCache) {
		return categoriesCache;
	}

	try {
		const products = await getAllProducts();

		// Extract unique categories and count products per category
		const categoryMap = new Map<string, number>();

		products.forEach((product: any) => {
			// Assuming your products have a category field - adjust as needed
			const categoryName = product.productCategory || 'Uncategorized';
			categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
		});

		// Convert map to array of Category objects
		const categories = Array.from(categoryMap.entries()).map(
			([name, productCount]) => ({
				name,
				productCount,
				slug: name
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, ''),
			})
		);

		// Sort alphabetically
		categories.sort((a, b) => a.name.localeCompare(b.name));

		// Cache the result
		categoriesCache = categories;

		return categories;
	} catch (error) {
		console.error('Error fetching categories:', error);
		return [];
	}
};
