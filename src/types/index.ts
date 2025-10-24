export interface Product {
	id: any;
	productName: string;
	productDescription: string;
	productPrice: number;
	productCategory: string;
	cartoonQuantity: number;
	imageUrl: string;
	discount?: number;
	brand: string;

	// Optional fields that might be used in the frontend but not in API
	rating?: number;
	reviews?: number;
	originalPrice?: number;
	salePrice?: number;
	isOutOfStock?: boolean;
	ingredients?: string[];
	discountDetails?: string;
}

export interface CartItem {
	id: string;
	productName: string;
	price: number;
	imageUrl: string;
	quantity: number;
	productCategory?: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	isAuthenticated: boolean;
}

export interface ShippingAddress {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

// export interface Order {
// 	id: string;
// 	items: CartItem[];
// 	total: number;
// 	shippingAddress: ShippingAddress;
// 	status: 'pending' | 'processing' | 'shipped' | 'delivered';
// 	createdAt: string;
// }

export interface StarRatingProps {
	rating?: number;
	reviews?: number;
	maxStars?: number;
}

// Shared types for orders and user data
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'pending';

export interface Order {
	id: string;
	productName: string;
	date: string;
	quantity: number;
	total: number;
	status: OrderStatus;
	image: string;
}

export interface UserData {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	addresses?: string[];
	city: string;
	state: string;
	country: string;
	dateCreated: number[];
	avatar?: string;
	imageUrl?: string;
	orders?: number;
	cartItems?: number;
	wishlistItems?: number;
	orderHistory?: Order[];
	token?: string;
}
