import Image from 'next/image';
import Link from 'next/link';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<main className='flex items-stretch justify-between w-full overflow-hidden bg-[#e7daeb] bg-blend-color'>
				{/* Left Section */}
				<div className='bg-white md:rounded-tr-[80px] md:rounded-br-[80px] flex-1 px-5 sm:px-10 md:px-20 flex flex-col justify-center py-10 min-h-screen'>
					<Link
						href='/'
						className='w-max'>
						<Image
							src='/Logo/rezino-logo.svg'
							alt='Rezino Logo'
							width={71}
							height={71}
							className='mt-6 mb-0'
						/>
					</Link>
					{children}
				</div>

				{/* Right Section */}
				<div className='flex-1 hidden md:block'>
					<Image
						src='/Onboarding/onboardingBackground.svg'
						alt='onboarding background'
						width={200}
						height={200}
						className='w-full h-full object-cover'
					/>
				</div>
			</main>
		</>
	);
}
