/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { messages } from '@/utils/data';
import { useMobileNav } from './MobileNavContext';
import { getUserProfileById } from '@/services/user';

const NAV_LINKS = [
	{ href: '/about', label: 'About' },
	{ href: '/about/#faq', label: 'Help' },
	{ href: '/about/#get-in-touch', label: 'Contact' },
];

const TopNav = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userInitials, setUserInitials] = useState('');
	const [userData, setUserData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [imageError, setImageError] = useState(false);
	const router = useRouter();
	const { data: session, status } = useSession();
	const { isOpen, close } = useMobileNav();

	const marqueeMessages = useMemo(() => [...messages, ...messages], []);

	const fetchUserProfile = useCallback(async () => {
		try {
			setIsLoading(true);

			const storedUser = localStorage.getItem('userData');
			const token = localStorage.getItem('authToken');

			if (!storedUser || !token) {
				// Check if user is logged in via Google OAuth
				if (session?.user) {
					setUserData({
						firstName: session.user.name?.split(' ')[0] || '',
						lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
						email: session.user.email || '',
						imageUrl: session.user.image || null,
					});
					const initials = `${session.user.name?.split(' ')[0]?.[0] || ''}${
						session.user.name?.split(' ')[1]?.[0] || ''
					}`.toUpperCase();
					setUserInitials(
						initials || session.user.email?.[0]?.toUpperCase() || '?'
					);
					setIsLoggedIn(true);
					setIsLoading(false);
					return;
				}

				setUserData(null);
				setIsLoggedIn(false);
				setIsLoading(false);
				return;
			}

			const parsedUser = JSON.parse(storedUser);
			const userId = parsedUser?.id;
			if (!userId) {
				setIsLoading(false);
				return;
			}

			const profile = await getUserProfileById(userId);
			if (profile) {
				setUserData(profile);
				setIsLoggedIn(true);

				const initials = `${profile.firstName?.[0] ?? ''}${
					profile.lastName?.[0] ?? ''
				}`.toUpperCase();
				setUserInitials(initials || profile.email?.[0]?.toUpperCase() || '?');
			}
		} catch (err) {
			console.error('Error fetching user profile:', err);
			setIsLoggedIn(false);
			setUserData(null);
		} finally {
			setIsLoading(false);
		}
	}, [session]);

	// Fetch profile on mount and when session changes
	useEffect(() => {
		fetchUserProfile();
	}, [fetchUserProfile, session, status]);

	// Listen for storage changes (for regular login)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'userData' || e.key === 'authToken') {
				fetchUserProfile();
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [fetchUserProfile]);

	// Listen for custom events (for same-tab login)
	useEffect(() => {
		const handleAuthChange = () => {
			fetchUserProfile();
		};

		window.addEventListener('auth-change', handleAuthChange);
		return () => window.removeEventListener('auth-change', handleAuthChange);
	}, [fetchUserProfile]);

	const handleSearch = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (searchQuery.trim()) {
				router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			}
		},
		[searchQuery, router]
	);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleSearch(e);
			}
		},
		[handleSearch]
	);

	const handleLogout = useCallback(async () => {
		try {
			localStorage.removeItem('authToken');
			localStorage.removeItem('userData');
			setIsLoggedIn(false);
			setUserInitials('');
			setUserData(null);
			setIsProfileOpen(false);

			if (session) {
				await signOut({ redirect: false });
			}

			// Dispatch custom event for other components
			window.dispatchEvent(new Event('auth-change'));

			close();
			router.push('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}, [session, router, close]);

	const toggleProfileDropdown = useCallback(() => {
		setIsProfileOpen((prev) => !prev);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (isProfileOpen && !target.closest('.profile-dropdown-container')) {
				setIsProfileOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isProfileOpen]);

	const ProfileAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
		const sizeClasses = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';
		const textSizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';

		if (userData?.imageUrl && !imageError) {
			return (
				<div
					className={`${sizeClasses} rounded-full overflow-hidden bg-gray-200`}>
					<img
						src={userData.imageUrl}
						alt={`${userData.firstName} ${userData.lastName}`}
						className='w-full h-full object-cover'
						onError={() => setImageError(true)}
					/>
				</div>
			);
		}

		return (
			<div
				className={`${sizeClasses} rounded-full flex items-center justify-center bg-primaryPurple text-white font-medium ${textSizeClasses}`}>
				{userInitials}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className='w-full  border-b'>
				<div className='flex items-center justify-between py-3 px-4'>
					<div className='h-6 w-20 bg-gray-200 animate-pulse rounded'></div>
					<div className='h-6 w-6 bg-gray-200 animate-pulse rounded'></div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className='w-full bg-primaryPurple text-white py-2 px-2 overflow-hidden relative z-50'>
				<div className='marquee whitespace-nowrap text-[13px] sm:text-base font-semibold flex items-center'>
					<span className='inline-block animate-marquee uppercase'>
						{marqueeMessages.map((msg, i) => (
							<span
								key={i}
								className='mx-8'>
								{msg}
							</span>
						))}
					</span>
				</div>
			</div>

			<div className='flex items-center justify-between py-3 md:py-5 px-2 md:px-4 lg:px-8.5'>
				{/* Logo */}
				<div className='flex items-center md:gap-2 lg:gap-4'>
					<Link href='/'>
						<Image
							src='/Logo/rezino-logo.svg'
							alt='rezino logo'
							className='h-7.5 w-7.5 lg:h-[77px] lg:w-[71px]'
							width={71}
							height={77}
						/>
					</Link>

					{/* Desktop/Tablet Search Bar */}
					<form
						onSubmit={handleSearch}
						className='hidden md:flex border-[0.5px] border-foreground/50 p-1 rounded-lg justify-between items-center h-12 '>
						<input
							type='text'
							placeholder='Search for products / brand'
							className='md:w-[260px] lg:w-[560px] outline-none pl-2 text-sm leading-[100%] tracking-normal text-foreground'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={handleKeyPress}
						/>
					</form>
				</div>

				{/* Mobile Search Bar */}
				<form
					onSubmit={handleSearch}
					className='md:hidden flex-1 mx-4'>
					<div className='border-[0.5px] border-foreground/50 p-1.5 rounded-lg flex justify-between items-center'>
						<input
							type='text'
							placeholder='Search products'
							className='flex-1 outline-none pl-2 text-sm leading-[100%] tracking-normal text-foreground'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={handleKeyPress}
						/>
						<button
							type='submit'
							className='bg-primaryPurple rounded-lg p-1.5 gap-2.5 flex items-center justify-center h-5 w-5'>
							<Image
								src='/Icons/header/search.svg'
								alt='search'
								height={10}
								width={10}
							/>
						</button>
					</div>
				</form>

				{/* Desktop/Tablet Navigation */}
				<div className='hidden md:flex items-center justify-center gap-3'>
					<ul className='flex items-center gap-3'>
						{NAV_LINKS.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className='hover:text-primaryPurple text-lg'>
									{link.label}
								</Link>
							</li>
						))}

						{isLoggedIn ? (
							<li className='relative group profile-dropdown-container'>
								<button
									onClick={toggleProfileDropdown}
									className='cursor-pointer'>
									<ProfileAvatar />
								</button>
								<div
									className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${
										isProfileOpen
											? 'opacity-100 visible'
											: 'opacity-0 invisible'
									} md:group-hover:opacity-100 md:group-hover:visible`}>
									<div className='px-4 py-2 border-b border-gray-100'>
										<p className='text-sm font-medium text-gray-900'>
											{userData?.firstName} {userData?.lastName}
										</p>
										<p className='text-xs text-gray-500 truncate'>
											{userData?.email}
										</p>
									</div>
									<Link
										href='/profile'
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Profile
									</Link>
									<button
										onClick={handleLogout}
										className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Logout
									</button>
								</div>
							</li>
						) : (
							<li>
								<Link
									href='/login'
									className='rounded-lg p-3 gap-2.5 flex items-center justify-center bg-primaryPurple text-white cursor-pointer'>
									Log In
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>

			{/* Backdrop Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/60 z-40 md:hidden'
					onClick={close}
				/>
			)}

			{/* Mobile Sidebar Menu */}
			<div
				className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
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

				<div className='p-4'>
					{isLoggedIn && (
						<div className='mb-4 p-3 bg-gray-50 rounded-lg'>
							<div className='flex items-center gap-3'>
								<div className='flex-shrink-0'>
									<ProfileAvatar size='md' />
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

					<ul className='flex flex-col gap-4'>
						<li>
							<Link
								href='/blog'
								className='block py-3 px-2 text-foreground hover:text-primaryPurple hover:bg-gray-50 rounded-lg transition-colors'
								onClick={close}>
								Blog
							</Link>
						</li>
						{NAV_LINKS.map((link) => (
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
								onClick={handleLogout}
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
};

export default TopNav;
