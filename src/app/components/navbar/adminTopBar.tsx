'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CategoriesDropdown from '../dropdown/CategoriesDropdown';

const AdminTopNav = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [userInitials, setUserInitials] = useState('');
	const [userData, setUserData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	// Define admin-only routes
	const adminRoutes = [
		'/admin',
		'/admin/dashboard',
		'/admin/users',
		'/admin/product',
		'/admin/order',
	];
	const isAdminRoute = adminRoutes.some((route) => pathname?.startsWith(route));

	// Check if user is logged in and has admin role on component mount
	useEffect(() => {
		const checkAuthStatus = () => {
			try {
				// Check for admin authentication first
				const adminToken = localStorage.getItem('adminAuthToken');
				const adminUserDataStr = localStorage.getItem('adminUserData');

				// Check for regular user authentication as fallback
				const userToken = localStorage.getItem('authToken');
				const userDataStr = localStorage.getItem('userData');

				let token, userDataString, user;

				// Prioritize admin auth if on admin route
				if (isAdminRoute && adminToken && adminUserDataStr) {
					token = adminToken;
					userDataString = adminUserDataStr;
					user = JSON.parse(adminUserDataStr);
				} else if (!isAdminRoute && userToken && userDataStr) {
					// Use regular user auth for non-admin routes
					token = userToken;
					userDataString = userDataStr;
					user = JSON.parse(userDataStr);
				} else if (adminToken && adminUserDataStr) {
					// Fallback to admin auth if available
					token = adminToken;
					userDataString = adminUserDataStr;
					user = JSON.parse(adminUserDataStr);
				} else if (userToken && userDataStr) {
					// Fallback to user auth if available
					token = userToken;
					userDataString = userDataStr;
					user = JSON.parse(userDataStr);
				}

				if (token && user) {
					setUserData(user);
					setIsLoggedIn(true);

					// Check if user has admin role
					const hasAdminRole =
						user.adminRole === 'ADMIN' || user.role === 'ADMIN';
					setIsAdmin(hasAdminRole);

					// Generate initials from user data
					if (user.firstName && user.lastName) {
						const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
							0
						)}`.toUpperCase();
						setUserInitials(initials);
					} else if (user.userName) {
						// Use username if firstName/lastName not available
						setUserInitials(user.userName.charAt(0).toUpperCase());
					} else if (user.email) {
						// Fallback to first letter of email
						setUserInitials(user.email.charAt(0).toUpperCase());
					}

					// If on admin route but user is not admin, redirect to home
					if (isAdminRoute && !hasAdminRole) {
						router.push('/');
						return;
					}
				} else {
					setIsLoggedIn(false);
					setIsAdmin(false);
					setUserInitials('');

					// If on admin route but not logged in, redirect to admin login
					if (isAdminRoute) {
						router.push('/admin/login');
						return;
					}
				}
			} catch (error) {
				console.error('Error checking auth status:', error);
				setIsLoggedIn(false);
				setIsAdmin(false);

				// If on admin route but error occurred, redirect to admin login
				if (isAdminRoute) {
					router.push('/admin/login');
					return;
				}
			} finally {
				setIsLoading(false);
			}
		};

		checkAuthStatus();

		// Listen for storage changes (e.g., login/logout in other tabs)
		const handleStorageChange = () => {
			checkAuthStatus();
		};

		window.addEventListener('storage', handleStorageChange);

		// Custom event listener for auth changes within the same tab
		window.addEventListener('authChange', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('authChange', handleStorageChange);
		};
	}, [router, pathname, isAdminRoute]);

	// Show loading state while checking auth
	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-3 md:py-5 px-2 md:px-4 lg:px-8.5'>
				<div className='animate-pulse flex items-center gap-4'>
					<div className='h-6.6 w-7 lg:h-[77px] lg:w-[71px] bg-gray-200 rounded'></div>
					<div className='h-8 w-32 bg-gray-200 rounded'></div>
				</div>
			</div>
		);
	}

	// If on admin route and not authenticated/authorized, don't render the nav
	if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
		return null;
	}

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			if (isAdminRoute) {
				// Admin search - redirect to admin search page
				router.push(
					`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`
				);
			} else {
				// Regular search - redirect to regular search page
				router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			}
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch(e);
		}
	};

	const handleLogout = () => {
		// Clear appropriate auth data based on current context
		if (isAdminRoute || isAdmin) {
			// Clear admin auth data
			localStorage.removeItem('adminAuthToken');
			localStorage.removeItem('adminUserData');
		} else {
			// Clear regular user auth data
			localStorage.removeItem('authToken');
			localStorage.removeItem('userData');
		}

		// Update state
		setIsLoggedIn(false);
		setIsAdmin(false);
		setUserInitials('');
		setUserData(null);

		// Dispatch event to notify other components
		window.dispatchEvent(new Event('authChange'));

		// Redirect based on current route
		if (isAdminRoute) {
			router.push('/admin/login');
		} else {
			router.push('/');
		}

		// Close mobile menu if open
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			<div className='flex items-center justify-between py-3 md:py-5 px-2 md:px-4 lg:px-8.5'>
				{/* Logo */}
				<div className='flex items-center md:gap-2 lg:gap-4'>
					<Link href={isAdminRoute ? '/admin/dashboard' : '/'}>
						<Image
							src='/Logo/rezino-logo.svg'
							alt='rezino logo'
							className='h-6.6 w-7 lg:h-[77px] lg:w-[71px]'
							width={71}
							height={77}
						/>
					</Link>
				</div>

				{/* Desktop/Tablet Search Bar - Always visible */}
				<form
					onSubmit={handleSearch}
					className='hidden md:flex border-[0.5px] border-foreground/50 p-1 rounded-lg justify-between items-center'>
					<input
						type='text'
						placeholder={
							isAdminRoute
								? 'Search users, products, orders...'
								: 'Search for products / brand'
						}
						className='md:w-[260px] lg:w-[560px] outline-none pl-2 text-sm leading-[100%] tracking-normal text-foreground'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyPress={handleKeyPress}
					/>

					<div className='flex items-center gap-2.5'>
						{/* Categories Dropdown - Only show on non-admin routes */}
						{!isAdminRoute && <CategoriesDropdown />}

						<button
							type='submit'
							className='bg-primaryPurple rounded-lg p-0.5 md:p-1 gap-2.5 flex items-center justify-center h-5 w-5 md:h-9 md:w-9.5'>
							<Image
								src='/Icons/header/search.svg'
								alt='search'
								className='md:h-[15px] md:w-[15px]'
								height={15}
								width={15}
							/>
						</button>
					</div>
				</form>

				{/* Mobile Search Bar - Always visible */}
				<form
					onSubmit={handleSearch}
					className='md:hidden flex-1 mx-4 mr-6'>
					<div className='border-[0.5px] border-foreground/50 p-2 rounded-lg flex justify-between items-center'>
						<input
							type='text'
							placeholder={isAdminRoute ? 'Search admin...' : 'Search products'}
							className='flex-1 outline-none pl-2 text-sm leading-[100%] tracking-normal text-foreground'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={handleKeyPress}
						/>
						<button
							type='submit'
							className='bg-primaryPurple rounded-lg p-1 gap-2.5 flex items-center justify-center h-5 w-5'>
							<Image
								src='/Icons/header/search.svg'
								alt='search'
								height={10}
								width={10}
							/>
						</button>
					</div>
				</form>

				{/* Desktop/Tablet Navigation - Hidden on Mobile */}
				<div className='hidden md:flex items-center justify-center gap-3'>
					<ul className='flex items-center gap-3'>
						{isLoggedIn ? (
							// User profile dropdown
							<div className='relative group'>
								<button className='rounded-full h-10 w-10 flex items-center justify-center bg-primaryPurple text-white font-medium text-sm cursor-pointer'>
									{userInitials}
								</button>

								{/* Dropdown menu */}
								<div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
									<div className='px-4 py-2 border-b border-gray-100'>
										<p className='text-sm font-medium text-gray-900'>
											{userData?.firstName} {userData?.lastName}
										</p>
										<p className='text-xs text-gray-500 truncate'>
											{userData?.email}
										</p>
										{isAdmin && (
											<p className='text-xs text-primaryPurple font-medium mt-1'>
												Admin
											</p>
										)}
									</div>
									{!isAdminRoute && (
										<Link
											href='/profile'
											className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
											Profile
										</Link>
									)}
									{isAdmin && !isAdminRoute && (
										<Link
											href='/admin/dashboard'
											className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
											Admin Panel
										</Link>
									)}
									{isAdmin && isAdminRoute && (
										<Link
											href='/'
											className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
											View Site
										</Link>
									)}
									<button
										onClick={handleLogout}
										className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Logout
									</button>
								</div>
							</div>
						) : (
							// Login button
							<Link
								href={isAdminRoute ? '/admin/login' : '/login'}
								className='rounded-lg p-3 gap-2.5 flex items-center justify-center bg-primaryPurple text-white cursor-pointer'>
								Log In
							</Link>
						)}
					</ul>
				</div>

				{/* Mobile Navigation */}
				<div className='md:hidden flex items-center gap-1'>
					{isLoggedIn && (
						<div className='mr-2 rounded-full h-8 w-8 flex items-center justify-center bg-primaryPurple text-white font-medium text-sm'>
							{userInitials}
						</div>
					)}
					{/* Mobile Hamburger Menu */}
					<button
						onClick={toggleMobileMenu}
						className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
						aria-label='Toggle menu'>
						{isMobileMenuOpen ? (
							<XMarkIcon className='w-6.5 h-6.5 text-black' />
						) : (
							<Bars3Icon className='w-6.5 h-6.5 text-black' />
						)}
					</button>
				</div>
			</div>

			{/* Backdrop Overlay */}
			{isMobileMenuOpen && (
				<div
					className='fixed inset-0 bg-black/60 bg-opacity-50 z-40 md:hidden'
					onClick={toggleMobileMenu}
				/>
			)}

			{/* Mobile Sidebar Menu */}
			<div
				className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
					isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
				{/* Sidebar Header */}
				<div className='flex items-center justify-between p-4 border-b border-gray-200'>
					<Image
						src='/Logo/rezino-logo.svg'
						alt='rezino logo'
						className='h-6.6 w-7'
						width={35}
						height={38}
					/>
					<button
						onClick={toggleMobileMenu}
						className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
						aria-label='Close menu'>
						<XMarkIcon className='w-5 h-5 text-black' />
					</button>
				</div>

				{/* Sidebar Content */}
				<div className='p-4'>
					{isLoggedIn && (
						<div className='mb-4 p-3 bg-gray-50 rounded-lg'>
							<p className='text-sm font-medium text-gray-900'>
								{userData?.firstName} {userData?.lastName}
							</p>
							<p className='text-xs text-gray-500 truncate'>
								{userData?.email}
							</p>
							{isAdmin && (
								<p className='text-xs text-primaryPurple font-medium mt-1'>
									Admin
								</p>
							)}
						</div>
					)}

					{/* Sidebar Login/Logout Button */}
					<div className='mt-6'>
						{isLoggedIn ? (
							<button
								onClick={handleLogout}
								className='w-full rounded-lg py-3 px-4 bg-gray-200 text-gray-800 hover:bg-opacity-90 transition-colors cursor-pointer'>
								Logout
							</button>
						) : (
							<Link
								href={isAdminRoute ? '/admin/login' : '/login'}
								className='block w-full text-center rounded-lg py-3 px-4 bg-primaryPurple text-white hover:bg-opacity-90 transition-colors cursor-pointer'
								onClick={toggleMobileMenu}>
								Log In
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminTopNav;
