import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface ProductsState {
	items: Product[];
	loading: boolean;
	error: string | null;
	filters: {
		category: string;
		priceRange: [number, number];
		searchQuery: string;
	};
}

const initialState: ProductsState = {
	items: [],
	loading: false,
	error: null,
	filters: {
		category: '',
		priceRange: [0, 1000],
		searchQuery: '',
	},
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async (params?: { category?: string; search?: string }) => {
		const queryParams = new URLSearchParams();
		if (params?.category) queryParams.append('category', params.category);
		if (params?.search) queryParams.append('search', params.search);

		const response = await fetch(`/api/products?${queryParams}`);
		if (!response.ok) throw new Error('Failed to fetch products');
		return response.json();
	}
);

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setFilters: (
			state,
			action: PayloadAction<Partial<ProductsState['filters']>>
		) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		clearFilters: (state) => {
			state.filters = initialState.filters;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch products';
			});
	},
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
