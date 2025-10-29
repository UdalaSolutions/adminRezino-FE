import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type NavItem = {
	label: string;
	href: string;
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	userData: any;
	userInitials: string;
	onLogout: () => void;
};

const navItems: NavItem[] = [
	{ label: 'Dashboard', href: '/admin/dashboard' },
	{ label: 'Product Management', href: '/admin/product' },
	{ label: 'Order Management', href: '/admin/order' },
	{ label: 'Payment Management', href: '/admin/payment' },
	{ label: 'Blog Management', href: '/admin/blog' },
];

const AdminSidebar: React.FC<Props> = ({
	isOpen,
	onClose,
	userData,
	userInitials,
	onLogout,
}) => {
	const pathname = usePathname();

	const renderNavItem = (item: NavItem) => {
		const isActive = pathname?.startsWith(item.href);
		return (
			<li key={item.href}>
				<Link
					href={item.href}
					className={`flex items-center gap-3 px-3 py-2 rounded-md text-base ${
						isActive
							? 'bg-primaryPurple/10 text-primaryPurple font-semibold'
							: 'text-[#111111] hover:bg-gray-100 font-medium'
					}`}
					onClick={() => {
						// Close sidebar on mobile after navigation
						onClose();
					}}>
					<span>{item.label}</span>
				</Link>
			</li>
		);
	};

	return (
		<>
			{/* Desktop sidebar */}
			<aside className='hidden md:flex md:flex-col md:w-62  bg-white border-r border-gray-200 p-3'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3'>
						<Image
							src='/Logo/rezino-logo.svg'
							alt='logo'
							width={35}
							height={38}
						/>
						<div className='text-sm font-semibold'>Admin Panel</div>
					</div>
				</div>

				<nav className='flex-1'>
					<ul className='space-y-2 mt-2'>{navItems.map(renderNavItem)}</ul>
				</nav>

				<div className='mt-4'>
					<button
						onClick={onLogout}
						className='w-full rounded-md py-2 px-3 bg-gray-100 hover:bg-gray-200 transition text-sm'>
						Logout
					</button>
				</div>
			</aside>

			{/* Mobile slide-over sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300 ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
				<div className='w-64 bg-white h-full shadow-lg flex flex-col'>
					<div className='flex items-center justify-between p-4 border-b'>
						<div className='flex items-center gap-3'>
							<Image
								src='/Logo/rezino-logo.svg'
								alt='logo'
								width={35}
								height={38}
							/>
							<div className='text-sm font-semibold'>Admin</div>
						</div>
						<button
							onClick={onClose}
							className='p-2 rounded-md'
							aria-label='Close menu'>
							<XMarkIcon className='w-5 h-5 text-black' />
						</button>
					</div>

					<div className='p-4'>
						{userData && (
							<div className='mb-4 p-3 bg-gray-50 rounded-md'>
								<div className='flex items-center gap-3'>
									<div className='h-10 w-10 rounded-full flex items-center justify-center bg-primaryPurple text-white font-medium'>
										{userInitials}
									</div>
									<div className='text-sm'>
										<div className='font-medium'>
											{userData?.firstName} {userData?.lastName}
										</div>
										<div className='text-xs text-gray-500 truncate'>
											{userData?.email}
										</div>
									</div>
								</div>
							</div>
						)}

						<nav>
							<ul className='space-y-2'>{navItems.map(renderNavItem)}</ul>
						</nav>

						<div className='mt-6'>
							<button
								onClick={() => {
									onLogout();
									onClose();
								}}
								className='w-full rounded-md py-2 px-3 bg-gray-100 hover:bg-gray-200 transition text-sm'>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile backdrop */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/40 z-40 md:hidden'
					onClick={onClose}
					aria-hidden
				/>
			)}
		</>
	);
};

export default AdminSidebar;
