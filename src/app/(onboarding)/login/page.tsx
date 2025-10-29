'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { Login as LoginService } from '@/services/auth';

// Define types based on the API response
interface UserData {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	city: string;
	state: string;
	country: string;
	dateCreated: number[];
	token?: string;
	imageUrl?: string;
}

interface LoginResponse {
	data: {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
		address: string;
		city: string;
		state: string;
		country: string;
		dateCreated: number[];
		message: string;
		token: string;
		imageUrl?: string;
	};
	successfully: boolean;
}

const Login = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get('redirect') || '/';

	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [formErrors, setFormErrors] = useState({
		email: '',
		password: '',
	});
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	// Check if remember me was previously set
	useEffect(() => {
		const remembered = localStorage.getItem('rememberMe') === 'true';
		setRememberMe(remembered);

		// If remember me is true, try to prefill email
		if (remembered) {
			const savedEmail = localStorage.getItem('rememberedEmail');
			if (savedEmail) {
				setFormData((prev) => ({ ...prev, email: savedEmail }));
			}
		}
	}, []);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));

		// Clear error when user types
		if (formErrors[id as keyof typeof formErrors]) {
			setFormErrors((prev) => ({
				...prev,
				[id]: '',
			}));
		}
	};

	const validateForm = (): boolean => {
		let isValid = true;
		const errors = {
			email: '',
			password: '',
		};

		// Validate email
		if (!formData.email.trim()) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = 'Please enter a valid email address';
			isValid = false;
		}

		// Validate password
		if (!formData.password) {
			errors.password = 'Password is required';
			isValid = false;
		} else if (formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters long';
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error('Please fix the form errors');
			return;
		}

		setIsLoading(true);

		try {
			// Call the login service
			const response: LoginResponse = await LoginService({
				email: formData.email.trim(),
				password: formData.password,
			});

			if (response.successfully && response.data.token) {
				// Show success toast
				toast.success(
					response.data.message || 'Login successful! Redirecting...'
				);

				// Store token
				const tokenData = {
					token: response.data.token,
				};

				localStorage.setItem('authToken', JSON.stringify(tokenData));

				// Store user data
				const userData: UserData = {
					id: response.data.id,
					firstName: response.data.firstName,
					lastName: response.data.lastName,
					email: response.data.email,
					phoneNumber: response.data.phoneNumber,
					address: response.data.address,
					city: response.data.city,
					state: response.data.state,
					country: response.data.country,
					dateCreated: response.data.dateCreated,
					token: response.data.token,
					imageUrl: response.data.imageUrl ?? null,
				};

				localStorage.setItem('userData', JSON.stringify(userData));

				// Dispatch custom event to notify other components (like TopNav)
				window.dispatchEvent(new Event('auth-change'));

				// Handle remember me
				if (rememberMe) {
					localStorage.setItem('rememberMe', 'true');
					localStorage.setItem('rememberedEmail', formData.email.trim());
				} else {
					localStorage.removeItem('rememberMe');
					localStorage.removeItem('rememberedEmail');
				}

				// Redirect after a short delay
				setTimeout(() => {
					router.push(redirectUrl);
				}, 1500);
			} else {
				throw new Error(response.data.message || 'Login failed');
			}
		} catch (err: any) {
			console.error('Login failed:', err);

			// More specific error messages
			let errorMessage = 'Login failed. Please try again.';

			if (err.response?.status === 401) {
				errorMessage = 'Invalid email or password';
			} else if (err.response?.status === 429) {
				errorMessage = 'Too many attempts. Please try again later.';
			} else if (err.response?.status >= 500) {
				errorMessage = 'Server error. Please try again later.';
			} else if (err.message) {
				errorMessage = err.message;
			}

			// Show error toast
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle Enter key press for form submission
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) {
			handleSubmit(e as any);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			setGoogleLoading(true);
			await signIn('google', { callbackUrl: redirectUrl });
			// NextAuth handles the redirect and session will be available immediately
		} catch (err) {
			toast.error('Google sign-in failed');
			return err;
		} finally {
			setGoogleLoading(false);
		}
	};

	return (
		<div className='mt-10 flex flex-col gap-4'>
			<div>
				<h1 className='text-2xl font-bold text-left text-foreground'>
					Welcome Back!
				</h1>
				<p className='text-foreground mt-2'>Enter your details to login</p>
			</div>

			{/* Google Sign-In Button */}
			<div className='flex flex-col gap-4'>
				<button
					type='button'
					onClick={handleGoogleSignIn}
					disabled={googleLoading}
					className='rounded-lg border border-gray-300 gap-2 items-center justify-center bg-white flex p-3 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primaryPurple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
					aria-label='Sign in with Google'>
					{googleLoading ? (
						<Image
							src='/Icons/loader.svg'
							alt='Loading...'
							width={20}
							height={20}
							className='animate-spin'
						/>
					) : (
						<>
							<Image
								src='/Icons/google.svg'
								alt='Google logo'
								width={24}
								height={24}
							/>
							<p className='text-lg'>Continue with Google</p>
						</>
					)}
				</button>
			</div>

			{/* OR divider */}
			<div className='relative flex items-center justify-center'>
				<div className='flex-grow border-t border-gray-300'></div>
				<span className='mx-4 text-gray-500 text-sm font-medium'>OR</span>
				<div className='flex-grow border-t border-gray-300'></div>
			</div>

			<form
				className='flex flex-col gap-8'
				onSubmit={handleSubmit}
				onKeyPress={handleKeyPress}
				noValidate>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='email'
						className='sr-only'>
						Email
					</label>
					<input
						id='email'
						type='email'
						placeholder='Enter your email'
						className={`bg-foreground/10 rounded-md px-3 py-3.5 focus:outline-none autofill:bg-foreground/10 autofill:text-foreground ${
							formErrors.email ? 'border border-red-500' : ''
						}`}
						autoComplete='email'
						aria-required='true'
						value={formData.email}
						onChange={handleInputChange}
						required
						disabled={isLoading}
						aria-describedby={formErrors.email ? 'email-error' : undefined}
					/>
					{formErrors.email && (
						<p
							id='email-error'
							className='text-red-500 text-sm mt-1'>
							{formErrors.email}
						</p>
					)}
				</div>

				<div className='flex flex-col gap-2 relative'>
					<label
						htmlFor='password'
						className='sr-only'>
						Password
					</label>
					<input
						id='password'
						type={showPassword ? 'text' : 'password'}
						placeholder='Enter password'
						className={`bg-foreground/10 rounded-md px-3 py-3.5 focus:outline-none pr-10 autofill:bg-foreground/10 autofill:text-foreground ${
							formErrors.password ? 'border border-red-500' : ''
						}`}
						autoComplete='current-password'
						aria-required='true'
						value={formData.password}
						onChange={handleInputChange}
						required
						disabled={isLoading}
						aria-describedby={
							formErrors.password ? 'password-error' : undefined
						}
					/>
					<button
						type='button'
						onClick={togglePasswordVisibility}
						className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md p-1'
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						aria-pressed={showPassword}
						disabled={isLoading}>
						{showPassword ? (
							<EyeSlashIcon className='h-5 w-5' />
						) : (
							<EyeIcon className='h-5 w-5' />
						)}
					</button>
					{formErrors.password && (
						<p
							id='password-error'
							className='text-red-500 text-sm mt-1'>
							{formErrors.password}
						</p>
					)}
				</div>

				<div className='flex justify-between items-center'>
					<div className='flex items-center gap-2'>
						<input
							id='rememberMe'
							type='checkbox'
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
							className='cursor-pointer'
							disabled={isLoading}
						/>
						<label
							htmlFor='rememberMe'
							className='cursor-pointer'>
							Remember me
						</label>
					</div>
					<Link
						href='/forgot-password'
						className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-2 py-1'>
						Forgot password?
					</Link>
				</div>

				<button
					type='submit'
					disabled={isLoading}
					className='flex justify-center items-center gap-2 bg-primaryPurple text-white! text-lg p-2.5 rounded-md hover:bg-primaryPurple/90 focus:outline-none focus:ring-2 focus:ring-primaryPurple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
					{isLoading && (
						<Image
							src='/Icons/loader.svg'
							alt='Loading...'
							width={20}
							height={20}
							className='animate-spin mr-2'
						/>
					)}
					{isLoading ? 'Logging in...' : 'Log In'}
				</button>

				<div className='flex space-x-1.5 items-center justify-start'>
					<span>Don&apos;t have an account?</span>
					<Link
						href='/email-verification'
						className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-1 py-1'>
						Sign Up
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Login;
