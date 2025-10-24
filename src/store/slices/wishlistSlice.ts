import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types/index';

interface WishlistState {
	items: CartItem[];
}

// Load initial state from localStorage
const loadWishlistFromStorage = (): CartItem[] => {
	if (typeof window !== 'undefined') {
		try {
			const savedWishlist = localStorage.getItem('wishlist');
			return savedWishlist ? JSON.parse(savedWishlist) : [];
		} catch (error) {
			console.error('Error loading wishlist from localStorage:', error);
			return [];
		}
	}
	return [];
};

// Save to localStorage
const saveWishlistToStorage = (items: CartItem[]) => {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem('wishlist', JSON.stringify(items));
		} catch (error) {
			console.error('Error saving wishlist to localStorage:', error);
		}
	}
};

const initialState: WishlistState = {
	items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState,
	reducers: {
		addToWishlist: (state, action: PayloadAction<CartItem>) => {
			const exists = state.items.some((item) => item.id === action.payload.id);
			if (!exists) {
				state.items.push(action.payload);
				saveWishlistToStorage(state.items);
			}
		},
		removeFromWishlist: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item.id !== action.payload);
			saveWishlistToStorage(state.items);
		},
		clearWishlist: (state) => {
			state.items = [];
			saveWishlistToStorage(state.items);
		},
	},
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
	wishlistSlice.actions;
export default wishlistSlice.reducer;
