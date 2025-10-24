import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types/index';

interface CartState {
	items: CartItem[];
	totalQuantity: number;
	totalAmount: number;
}

const initialState: CartState = {
	items: [],
	totalQuantity: 0,
	totalAmount: 0,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (
			state,
			action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>
		) => {
			const { quantity = 1, ...itemData } = action.payload;
			const existingItem = state.items.find((item) => item.id === itemData.id);

			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				state.items.push({ ...itemData, quantity });
			}

			cartSlice.caseReducers.calculateTotals(state);
		},

		removeFromCart: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item.id !== action.payload);
			cartSlice.caseReducers.calculateTotals(state);
		},

		updateQuantity: (
			state,
			action: PayloadAction<{ id: string; quantity: number }>
		) => {
			const item = state.items.find((item) => item.id === action.payload.id);
			if (item) {
				item.quantity = action.payload.quantity;
				if (item.quantity <= 0) {
					state.items = state.items.filter(
						(item) => item.id !== action.payload.id
					);
				}
			}
			cartSlice.caseReducers.calculateTotals(state);
		},

		clearCart: (state) => {
			state.items = [];
			state.totalQuantity = 0;
			state.totalAmount = 0;
		},

		calculateTotals: (state) => {
			state.totalQuantity = state.items.reduce(
				(total, item) => total + item.quantity,
				0
			);
			state.totalAmount = state.items.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			);
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
	cartSlice.actions;
export default cartSlice.reducer;
