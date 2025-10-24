'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { AdminLogin } from '@/services/auth';

// Backend returns this shape for success and error:
interface AdminLoginResponse {
	data: any; // string for error, object for success
	successfully: boolean;
}

const AdminLoginPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';

	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formErrors, setFormErrors] = useState({
		email: '',
		password: '',
	});
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	useEffect(() => {
		const checkExistingAuth = () => {
			try {
				const adminToken = localStorage.getItem('adminAuthToken');
				const adminUserData = localStorage.getItem('adminUserData');
				if (adminToken && adminUserData) {
					router.push('/admin/dashboard');
					return;
				}
			} catch (error) {
				console.error('Error checking existing auth:', error);
			}
		};
		checkExistingAuth();
		const remembered = localStorage.getItem('rememberMe') === 'true';
		setRememberMe(remembered);
		if (remembered) {
			const savedEmail = localStorage.getItem('rememberedEmail');
			if (savedEmail) setFormData((prev) => ({ ...prev, email: savedEmail }));
		}
	}, [router]);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
		if (formErrors[id as keyof typeof formErrors]) {
			setFormErrors((prev) => ({ ...prev, [id]: '' }));
		}
	};

	const validateForm = (): boolean => {
		let isValid = true;
		const errors = { email: '', password: '' };
		if (!formData.email.trim()) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = 'Please enter a valid email address';
			isValid = false;
		}
		if (!formData.password) {
			errors.password = 'Password is required';
			isValid = false;
		} else if (formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
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
			const response: AdminLoginResponse = await AdminLogin({
				email: formData.email.trim(),
				password: formData.password,
			});

			if (response.successfully && response.data.token) {
				toast.success(
					response.data.message || 'Login successful! Redirecting...'
				);
				localStorage.setItem(
					'authToken',
					JSON.stringify({ token: response.data.token })
				);
				localStorage.setItem('adminAuthToken', response.data.token);

				// Store admin profile data
				const adminData = {
					firstName: response.data.firstName,
					lastName: response.data.lastName,
					userName: response.data.userName,
					email: response.data.email,
					dateCreated: response.data.dateCreated,
					adminRole: response.data.adminRole,
				};
				localStorage.setItem('adminUserData', JSON.stringify(adminData));

				if (rememberMe) {
					localStorage.setItem('rememberMe', 'true');
					localStorage.setItem('rememberedEmail', formData.email.trim());
				} else {
					localStorage.removeItem('rememberMe');
					localStorage.removeItem('rememberedEmail');
				}

				window.dispatchEvent(new Event('authChange'));
				setTimeout(() => {
					router.push(redirectUrl);
				}, 500);
			} else {
				// Always show backend message (data property), even if not successful
				toast.error(
					typeof response.data === 'string'
						? response.data
						: response.data?.message || 'Login failed'
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) handleSubmit(e as any);
	};

	return (
		<div className='mt-10 flex flex-col gap-4'>
			<div>
				<h1 className='text-2xl font-bold text-left text-foreground'>
					Welcome Admin!
				</h1>
				<p className='text-foreground mt-2'>
					Enter your admin credentials to login
				</p>
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
						href='/admin/forgot-password'
						className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-2 py-1'>
						Forgot password?
					</Link>
				</div>
				<button
					type='submit'
					disabled={isLoading}
					className='flex justify-center items-center gap-2 bg-primaryPurple text-white text-lg p-2.5 rounded-md hover:bg-primaryPurple/90 focus:outline-none focus:ring-2 focus:ring-primaryPurple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
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
					<span>Don&apos;t have an admin account?</span>
					<Link
						href='/email-verification'
						className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-1 py-1'>
						Sign In
					</Link>
				</div>
			</form>
		</div>
	);
};

export default AdminLoginPage;
