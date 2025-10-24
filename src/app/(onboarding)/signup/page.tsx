'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { adminSignup } from '@/services/auth';

const AdminSignup = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const togglePassword = () => setShowPassword((p) => !p);
	const toggleConfirmPassword = () => setShowConfirmPassword((p) => !p);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords don't match");
			return;
		}

		setLoading(true);
		try {
			const res = await adminSignup({
				firstName: formData.firstName,
				lastName: formData.lastName,
				userName: formData.userName,
				email: formData.email,
				password: formData.password,
			});

			toast.success(res.message || 'Admin account created successfully!');
			router.push('/admin/login');
		} catch (error: any) {
			toast.error(error.message || 'Admin signup failed.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col gap-4 h-full pt-5 pb-10'>
			<h1 className='text-2xl font-bold'>Create an Admin Account</h1>
			<p className='text-gray-600'>
				Enter your details to register as an admin.
			</p>

			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-6'>
				<div className='grid grid-cols-2 gap-2'>
					<input
						name='firstName'
						type='text'
						placeholder='First name'
						value={formData.firstName}
						onChange={handleChange}
						className='bg-gray-100 rounded-md px-3 py-3.5 focus:outline-none'
						required
					/>
					<input
						name='lastName'
						type='text'
						placeholder='Last name'
						value={formData.lastName}
						onChange={handleChange}
						className='bg-gray-100 rounded-md px-3 py-3.5 focus:outline-none'
						required
					/>
				</div>

				<input
					name='userName'
					type='text'
					placeholder='Username'
					value={formData.userName}
					onChange={handleChange}
					className='bg-gray-100 rounded-md px-3 py-3.5 focus:outline-none'
					required
				/>

				<input
					name='email'
					type='email'
					placeholder='Email address'
					value={formData.email}
					onChange={handleChange}
					className='bg-gray-100 rounded-md px-3 py-3.5 focus:outline-none'
					required
				/>

				<div className='grid grid-cols-2 gap-2'>
					<div className='relative bg-gray-100 rounded-md px-3 py-3.5'>
						<input
							name='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							value={formData.password}
							onChange={handleChange}
							className='focus:outline-none pr-10 bg-transparent'
							required
						/>
						<button
							type='button'
							onClick={togglePassword}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
							{showPassword ? (
								<EyeSlashIcon className='h-5 w-5' />
							) : (
								<EyeIcon className='h-5 w-5' />
							)}
						</button>
					</div>

					<div className='relative bg-gray-100 rounded-md px-3 py-3.5'>
						<input
							name='confirmPassword'
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder='Confirm Password'
							value={formData.confirmPassword}
							onChange={handleChange}
							className='focus:outline-none pr-10 bg-transparent'
							required
						/>
						<button
							type='button'
							onClick={toggleConfirmPassword}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
							{showConfirmPassword ? (
								<EyeSlashIcon className='h-5 w-5' />
							) : (
								<EyeIcon className='h-5 w-5' />
							)}
						</button>
					</div>
				</div>

				<button
					type='submit'
					disabled={loading}
					className='flex justify-center items-center bg-primaryPurple text-white text-lg p-3 rounded-md hover:bg-primaryPurple/90 disabled:opacity-50'>
					{loading ? 'Signing up...' : 'Sign Up as Admin'}
				</button>
			</form>
		</div>
	);
};

export default AdminSignup;
