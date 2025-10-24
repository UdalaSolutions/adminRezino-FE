'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const AdminBottomNavbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const navItems = [
		{ label: 'Product Management', href: '/admin/product' },
		{ label: 'Order Management', href: '/admin/order' },
		{ href: '/admin/payment', label: 'Payment Management' },
		{ href: '/admin/blog', label: 'Blog Management' },
	];

	return (
		<>
			<nav className='bg-primaryPurple p-4 lg:p-5 rounded-lg flex items-center justify-between mx-2 md:mx-4 lg:mx-8.5 text-white'>
				{/* Mobile Menu Button */}
				<button
					onClick={toggleMobileMenu}
					className='lg:hidden flex items-center gap-2 p-2 rounded-md hover:bg-primaryPurple/80 transition-colors'
					aria-label='Toggle menu'
					aria-expanded={isMobileMenuOpen}>
					{isMobileMenuOpen ? (
						<XMarkIcon className='w-5 h-5 text-white' />
					) : (
						<Bars3Icon className='w-5 h-5 text-white' />
					)}
					<span className='text-sm'>Menu</span>
				</button>

				{/* Desktop Categories */}
				<div className='hidden lg:flex items-center gap-2'>
					<FunnelIcon className='w-5 h-5 text-white' />
					<p className='text-sm lg:text-base'>Date Filter</p>
				</div>

				{/* Desktop Navigation */}
				<ul className='hidden lg:flex items-center gap-6 xl:gap-8'>
					{navItems.map((item, index) => (
						<li key={index}>
							{item.href ? (
								<Link
									href={item.href}
									className='cursor-pointer text-sm xl:text-base hover:opacity-80 transition-opacity'>
									{item.label}
								</Link>
							) : (
								<div className='flex items-center gap-1.5 cursor-pointer text-sm xl:text-base hover:opacity-80 transition-opacity'>
									{item.label}
								</div>
							)}
						</li>
					))}
				</ul>
			</nav>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className='lg:hidden fixed inset-0 bg-black/60 bg-opacity-50 z-50'
					onClick={toggleMobileMenu}>
					<div
						className='absolute top-0 left-0 w-3/4 h-full bg-primaryPurple p-6'
						onClick={(e) => e.stopPropagation()}>
						<button
							onClick={toggleMobileMenu}
							className='absolute top-4 right-4 p-2'
							aria-label='Close menu'>
							<XMarkIcon className='w-6 h-6 text-white' />
						</button>

						<div className='mt-12'>
							<div className='flex items-center gap-2 mb-8'>
								<Bars3Icon className='w-5 h-5 text-white' />
								<p className='text-white'>Browse Categories</p>
							</div>

							<ul className='space-y-4'>
								{navItems.map((item, index) => (
									<li key={index}>
										{item.href ? (
											<Link
												href={item.href}
												className='block py-3 text-white hover:bg-primaryPurple/80 transition-colors rounded-md px-3'
												onClick={toggleMobileMenu}>
												{item.label}
											</Link>
										) : (
											<div className='flex items-center justify-between py-3 text-white hover:bg-primaryPurple/80 transition-colors rounded-md px-3 cursor-pointer'>
												<span>{item.label}</span>
											</div>
										)}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AdminBottomNavbar;
