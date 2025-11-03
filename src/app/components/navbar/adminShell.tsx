'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'antd';
import AdminHeader from './adminHeader';
import AdminSidebar from './adminSidebar';

type Props = {
	children: React.ReactNode;
};

export default function AdminShell({ children }: Props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [userData, setUserData] = useState<any>(null);
	const [userInitials, setUserInitials] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showTimeoutModal, setShowTimeoutModal] = useState(false);

	const getTokenExpiry = (token: string) => {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.exp ? payload.exp * 1000 : null;
		} catch (e) {
			console.error('Invalid token format', e);
			return null;
		}
	};

	useEffect(() => {
		const checkAuth = () => {
			try {
				const adminToken = localStorage.getItem('adminAuthToken');
				const adminUserDataStr = localStorage.getItem('adminUserData');

				if (adminToken && adminUserDataStr) {
					const user = JSON.parse(adminUserDataStr);

					// ROLE CHECK
					const hasAdminRole =
						user.adminRole === 'ADMIN' || user.role === 'ADMIN';

					if (!hasAdminRole) {
						router.push('/');
						return;
					}

					// TOKEN EXPIRY CHECK
					const expTime = getTokenExpiry(adminToken);
					if (expTime && Date.now() > expTime) {
						setShowTimeoutModal(true);
						return;
					}

					setUserData(user);
					setIsLoggedIn(true);

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
				} else {
					router.push('/admin/login');
					return;
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

		// Listen for login/logout from other tabs
		const onStorage = () => checkAuth();
		window.addEventListener('storage', onStorage);
		window.addEventListener('authChange', onStorage);

		return () => {
			window.removeEventListener('storage', onStorage);
			window.removeEventListener('authChange', onStorage);
		};
	}, [router]);

	// Logout handler
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

	const toggleSidebar = () => setIsSidebarOpen((s) => !s);

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

				<main className='flex-1 overflow-auto '>{children}</main>
			</div>

			{/* TOKEN EXPIRED MODAL */}
			<Modal
				title='Session Expired'
				open={showTimeoutModal}
				closable={false}
				footer={[
					<Button
						key='login'
						type='primary'
						onClick={handleLogout}>
						Login Again
					</Button>,
				]}>
				<p>Your session has expired. Please log in again to continue.</p>
			</Modal>
		</div>
	);
}
