/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { VerifyEmail, SendVerificationEmail } from '@/services/auth';
import { useRouter, useSearchParams } from 'next/navigation';

const OtpVerification = () => {
	const [otp, setOtp] = useState(Array(6).fill(''));
	const [loading, setLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(60); // 1 minute countdown
	const [resending, setResending] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email');

	// Countdown logic
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (resendTimer > 0) {
			timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
		}
		return () => clearTimeout(timer);
	}, [resendTimer]);

	const handleChange = (value: string, index: number) => {
		if (/^[a-zA-Z0-9]?$/.test(value)) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);

			// Move focus to next input
			if (value && index < 5) {
				const nextInput = document.getElementById(`otp-${index + 1}`);
				nextInput?.focus();
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const otpCode = otp.join('');

		if (otpCode.length !== 6) {
			toast.error('Please enter the full 6-character OTP.');
			return;
		}

		if (!email) {
			toast.error('Email is missing.');
			return;
		}

		try {
			setLoading(true);
			const res = await VerifyEmail({ email, otp: otpCode });
			toast.success(res.message || 'Email verified successfully!');
			router.push('/signup'); // redirect after verification success
		} catch (err: any) {
			toast.error(err.message || 'Verification failed.');
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!email) {
			toast.error('Email is missing.');
			return;
		}

		try {
			setResending(true);
			await SendVerificationEmail({ email });
			toast.success('A new OTP has been sent to your email.');
			setResendTimer(60);
		} catch (err: any) {
			toast.error(err.message || 'Failed to resend code.');
		} finally {
			setResending(false);
		}
	};

	return (
		<div className='mt-10 flex flex-col gap-4'>
			<div>
				<h1 className='text-2xl font-bold text-left text-foreground'>
					Verify OTP
				</h1>
				<p className='text-foreground mt-2'>
					Enter the 6-character code sent to your email
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-8'>
				<div className='flex xs:gap-3 gap-4 sm:gap-6'>
					{otp.map((digit, index) => (
						<input
							key={index}
							id={`otp-${index}`}
							type='text'
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(e.target.value, index)}
							className='xs:h-8 xs:w-8 h-10 w-10 sm:w-12 sm:h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryPurple'
						/>
					))}
				</div>

				<button
					type='submit'
					disabled={loading}
					className={`flex justify-center items-center bg-primaryPurple text-white! text-lg p-2.5 rounded-md transition-colors
						${
							loading
								? 'opacity-70 cursor-not-allowed'
								: 'hover:bg-primaryPurple/90 focus:outline-none focus:ring-2 focus:ring-primaryPurple focus:ring-offset-2'
						}`}>
					{loading ? (
						<Image
							src='/Icons/loader.svg'
							alt='Loading...'
							width={20}
							height={20}
							className='animate-spin mr-2'
						/>
					) : null}
					{loading ? 'Verifying...' : 'Verify Code'}
				</button>

				<div className='flex space-x-1.5 items-center justify-start'>
					<span>Didn’t get a code?</span>
					{resendTimer > 0 ? (
						<span className='text-gray-500'>
							Resend available in {resendTimer}s
						</span>
					) : (
						<button
							type='button'
							onClick={handleResend}
							disabled={resending}
							className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-1 py-1'>
							{resending ? 'Resending...' : 'Resend'}
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default OtpVerification;
