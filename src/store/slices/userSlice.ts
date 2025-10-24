import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, ShippingAddress } from '@/types';

interface UserState {
	user: User | null;
	shippingAddress: ShippingAddress | null;
	loading: boolean;
	error: string | null;
}

const initialState: UserState = {
	user: null,
	shippingAddress: null,
	loading: false,
	error: null,
};

export const loginUser = createAsyncThunk(
	'user/login',
	async (credentials: { email: string; password: string }) => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		});
		if (!response.ok) throw new Error('Login failed');
		return response.json();
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.shippingAddress = null;
		},
		setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
			state.shippingAddress = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Login failed';
			});
	},
});

export const { logout, setShippingAddress, clearError } = userSlice.actions;
export default userSlice.reducer;
