'use client';

import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMobileNav } from './MobileNavContext';

type MobileDrawerProps = {
	isLoggedIn: boolean;
	userInitials: string;
	userData: any;
	onLogout: () => void;
	navLinks: { href: string; label: string }[];
};

export default function MobileDrawer({
	isLoggedIn,
	userInitials,
	userData,
	onLogout,
	navLinks,
}: MobileDrawerProps) {
	const { isOpen, close } = useMobileNav();

	// Slide-down sheet from the top on mobile
	return (
		<>
			{/* Backdrop */}
			<div
				aria-hidden={!isOpen}
				className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${
					isOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}`}
				onClick={close}
			/>

			{/* Drawer (Top Sheet) */}
			<div
				id='mobile-drawer'
				role='dialog'
				aria-modal='true'
				className={`fixed top-0 left-0 right-0 z-50 md:hidden bg-white rounded-b-2xl shadow-xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
				style={{ height: '85vh' }}>
				<div className='flex items-center justify-between p-4 border-b border-gray-200'>
					<Image
						src='/Logo/rezino-logo.svg'
						alt='rezino logo'
						className='h-6.6 w-7'
						width={35}
						height={38}
					/>
					<button
						onClick={close}
						className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
						aria-label='Close menu'>
						<XMarkIcon className='w-5 h-5 text-black' />
					</button>
				</div>

				<div className='p-4 overflow-y-auto h-[calc(85vh-64px)]'>
					{isLoggedIn && (
						<div className='mb-4 p-3 bg-gray-50 rounded-lg'>
							<div className='flex items-center gap-3'>
								<div className='rounded-full h-10 w-10 flex items-center justify-center bg-primaryPurple text-white font-medium text-sm flex-shrink-0'>
									{userInitials}
								</div>
								<div className='min-w-0 flex-1'>
									<p className='text-sm font-medium text-gray-900 truncate'>
										{userData?.firstName} {userData?.lastName}
									</p>
									<p className='text-xs text-gray-500 truncate'>
										{userData?.email}
									</p>
								</div>
							</div>
						</div>
					)}

					<ul className='flex flex-col gap-2'>
						{/* You had a Blog link in your original sidebar */}
						<li>
							<Link
								href='/blog'
								className='block py-3 px-2 text-foreground hover:text-primaryPurple hover:bg-gray-50 rounded-lg transition-colors'
								onClick={close}>
								Blog
							</Link>
						</li>

						{navLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className='block py-3 px-2 text-foreground hover:text-primaryPurple hover:bg-gray-50 rounded-lg transition-colors'
									onClick={close}>
									{link.label}
								</Link>
							</li>
						))}

						{isLoggedIn && (
							<li>
								<Link
									href='/profile'
									className='block py-3 px-2 text-foreground hover:text-primaryPurple hover:bg-gray-50 rounded-lg transition-colors'
									onClick={close}>
									Profile
								</Link>
							</li>
						)}
					</ul>

					<div className='mt-6'>
						{isLoggedIn ? (
							<button
								onClick={() => {
									onLogout();
								}}
								className='w-full rounded-lg py-3 px-4 bg-gray-200 text-gray-800 hover:bg-opacity-90 transition-colors cursor-pointer'>
								Logout
							</button>
						) : (
							<Link
								href='/login'
								className='block text-center w-full rounded-lg py-3 px-4 bg-primaryPurple text-white hover:bg-opacity-90 transition-colors cursor-pointer'
								onClick={close}>
								Log In
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
