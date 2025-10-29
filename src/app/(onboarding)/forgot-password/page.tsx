import Link from 'next/link';

const ForgotPassword = () => {
	return (
		<>
			<div className='mt-10 flex flex-col gap-4 '>
				<div>
					<h1 className='text-2xl font-bold text-left text-foreground'>
						Forgot Password?
					</h1>
					<p className='text-foreground mt-2'>
						Enter email address associated with your account
					</p>
				</div>

				<form className='flex flex-col gap-8'>
					<div className='flex flex-col gap-2'>
						<label
							htmlFor='username'
							className='sr-only'>
							Email Address
						</label>
						<input
							id='username'
							type='text'
							placeholder='Enter email address'
							className='bg-foreground/10 rounded-md px-3 py-3.5 focus:outline-none autofill:bg-foreground/10 autofill:text-foreground'
							autoComplete='username'
							aria-required='true'
						/>
					</div>

					<button
						type='submit'
						className='flex justify-center items-center bg-primaryPurple text-white! text-lg p-2.5 rounded-md hover:bg-primaryPurple/90 focus:outline-none focus:ring-2 focus:ring-primaryPurple focus:ring-offset-2 transition-colors'>
						Send Code
					</button>

					<div className='flex space-x-1.5 items-center justify-start'>
						<span>Don&apos;t have an account?</span>
						<Link
							href='/signup'
							className='text-primaryPurple hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPurple rounded-md px-1 py-1'>
							Sign Up
						</Link>
					</div>
				</form>
			</div>
		</>
	);
};
export default ForgotPassword;
