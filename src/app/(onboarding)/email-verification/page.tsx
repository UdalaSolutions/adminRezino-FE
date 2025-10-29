'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SendVerificationEmail as sendVerification } from '@/services/auth';
import { toast } from 'react-toastify';

const EmailVerification = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Only redirect if admin is already logged in
	useEffect(() => {
		const checkAuth = () => {
			try {
				const adminToken = localStorage.getItem('adminAuthToken');
				if (adminToken) {
					// Already logged in as admin, redirect to admin dashboard
					router.push('/admin/dashboard');
				}
			} catch (error) {
				console.error('Error checking auth status:', error);
			}
		};

		checkAuth();
	}, [router]);

	const handleEmailSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.error('Please enter an email address');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error('Please enter a valid email address');
			return;
		}

		setLoading(true);

		sendVerification({ email })
			.then((data) => {
				toast.success('Verification email sent successfully!');
				router.push(
					`/email-verification/otp?email=${encodeURIComponent(email)}`
				);
				return data;
			})
			.catch((err) => {
				console.error('Email verification error:', err);
				toast.error(
					err.message || 'Failed to send verification email. Please try again.'
				);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className='mt-10 flex flex-col gap-6 sm:gap-4'>
			<div>
				<h1 className='text-2xl font-bold text-left text-foreground'>
					Email Verification
				</h1>
				<p className='text-foreground mt-2'>
					Enter your email address to verify your account
				</p>
			</div>

			{/* Email Form */}
			<form
				onSubmit={handleEmailSubmit}
				className='flex flex-col gap-8'>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='email'
						className='sr-only'>
						Email Address
					</label>
					<input
						id='email'
						name='email'
						type='email'
						placeholder='Enter email address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='bg-foreground/10 rounded-md px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-primaryPurple autofill:bg-foreground/10 autofill:text-foreground'
						autoComplete='email'
						aria-required='true'
						disabled={loading}
					/>
				</div>

				<button
					type='submit'
					disabled={loading || !email.trim()}
					className={`flex justify-center items-center bg-primaryPurple text-white! text-lg p-2.5 rounded-md transition-colors min-h-[52px]
            ${
							loading || !email.trim()
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-primaryPurple/90 focus:outline-none focus:ring-2 focus:ring-primaryPurple focus:ring-offset-2'
						}`}>
					{loading && (
						<Image
							src='/Icons/loader.svg'
							alt='Loading...'
							width={20}
							height={20}
							className='animate-spin mr-2'
						/>
					)}
					{loading ? 'Sending...' : 'Send Verification Code'}
				</button>

				<div className='flex space-x-1.5 items-center justify-start text-sm'>
					<span className='text-gray-600'>Already have an account?</span>
					<Link
						href='/admin/login'
						className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-1 py-1'>
						Sign In
					</Link>
				</div>
			</form>
		</div>
	);
};

export default EmailVerification;
