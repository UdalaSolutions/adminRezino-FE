'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminHeader from './adminHeader';
import AdminSidebar from './adminSidebar';

type Props = {
	children: React.ReactNode;
};

// Helper: Decode JWT without a library
function decodeJwt(token: string) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	return JSON.parse(atob(base64));
}

// Helper: Check expiry
function isTokenExpired(token: string) {
	try {
		const { exp } = decodeJwt(token);
		return Date.now() >= exp * 1000; // convert seconds to ms
	} catch {
		return true; // if decoding fails, treat as expired
	}
}

export default function AdminShell({ children }: Props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [userData, setUserData] = useState<any>(null);
	const [userInitials, setUserInitials] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const checkAuth = () => {
			try {
				const adminToken = localStorage.getItem('adminAuthToken');
				const adminUserDataStr = localStorage.getItem('adminUserData');

				// No token OR user data → force login
				if (!adminToken || !adminUserDataStr) {
					router.push('/admin/login');
					return;
				}

				// Token expired → logout + redirect
				if (isTokenExpired(adminToken)) {
					localStorage.removeItem('adminAuthToken');
					localStorage.removeItem('adminUserData');
					toast.error('Session expired, please log in again.');
					router.push('/admin/login');
					return;
				}

				// Token still valid → validate user role
				const user = JSON.parse(adminUserDataStr);
				const hasAdminRole =
					user.adminRole === 'ADMIN' || user.role === 'ADMIN';

				if (!hasAdminRole) {
					router.push('/');
					return;
				}

				setUserData(user);
				setIsLoggedIn(true);

				//  Set initials
				if (user.firstName && user.lastName) {
					setUserInitials(
						`${user.firstName.charAt(0)}${user.lastName.charAt(
							0
						)}`.toUpperCase()
					);
				} else if (user.userName) {
					setUserInitials(user.userName.charAt(0).toUpperCase());
				} else if (user.email) {
					setUserInitials(user.email.charAt(0).toUpperCase());
				}
			} catch (err) {
				console.error('Admin auth check failed', err);
				router.push('/admin/login');
				return;
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();

		// Re-check auth when storage changes (e.g., logout from another tab)
		const onStorage = () => checkAuth();
		window.addEventListener('storage', onStorage);
		window.addEventListener('authChange', onStorage);

		return () => {
			window.removeEventListener('storage', onStorage);
			window.removeEventListener('authChange', onStorage);
		};
	}, [router]);

	const toggleSidebar = () => setIsSidebarOpen((s) => !s);

	// Manual logout handler
	const handleLogout = () => {
		localStorage.removeItem('adminAuthToken');
		localStorage.removeItem('adminUserData');
		window.dispatchEvent(new Event('authChange'));
		setIsSidebarOpen(false);
		setIsLoggedIn(false);
		setUserData(null);
		setUserInitials('');
		router.push('/admin/login');
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-40'>
				<div className='animate-pulse flex items-center gap-4'>
					<div className='h-6 w-7 bg-gray-200 rounded' />
					<div className='h-8 w-32 bg-gray-200 rounded' />
				</div>
			</div>
		);
	}

	if (!isLoggedIn) return null;

	return (
		<div className='flex h-screen bg-[#F9F8FA]'>
			<AdminSidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				userData={userData}
				userInitials={userInitials}
				onLogout={handleLogout}
			/>

			<div className='flex-1 flex flex-col'>
				<AdminHeader
					isSidebarOpen={isSidebarOpen}
					toggleSidebar={toggleSidebar}
					userInitials={userInitials}
					userData={userData}
					onLogout={handleLogout}
				/>

				<main className='flex-1 overflow-auto'>{children}</main>
			</div>
		</div>
	);
}
