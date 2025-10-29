import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	userInitials: string;
	userData: any;
	onLogout: () => void;
};

const AdminHeader: React.FC<Props> = ({
	isSidebarOpen,
	toggleSidebar,
	userInitials,
	userData,
	onLogout,
}) => {
	return (
		<header className='flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 border-b border-gray-200 bg-white z-20'>
			<div className='flex items-center gap-3'>
				{/* Mobile hamburger to open/close sidebar */}
				<button
					onClick={toggleSidebar}
					className='md:hidden p-2 rounded-md hover:bg-gray-100'
					aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}>
					{isSidebarOpen ? (
						<XMarkIcon className='w-6 h-6 text-black' />
					) : (
						<Bars3Icon className='w-6 h-6 text-black' />
					)}
				</button>
			</div>

			{/* Right side - user profile / logout */}
			<div className='flex items-center gap-3'>
				<div className='hidden md:flex items-center gap-3'>
					<div className='text-sm text-gray-700'>
						<div className='font-medium'>
							{userData?.firstName} {userData?.lastName}
						</div>
						<div className='text-xs text-gray-500 truncate'>
							{userData?.email}
						</div>
					</div>
				</div>

				<div className='relative'>
					<button
						className='rounded-full h-10 w-10 flex items-center justify-center bg-primaryPurple text-white font-medium text-sm'
						title='Open profile'
						onClick={() => {}}>
						{userInitials || 'U'}
					</button>
				</div>

				<div className='hidden md:block'>
					<button
						onClick={onLogout}
						className='ml-2 rounded-lg py-2 px-3 bg-gray-100 text-gray-800 hover:bg-gray-200 transition'>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
};

export default AdminHeader;
