'use client';

import { useState, useRef, useEffect } from 'react';
import {
	Bars3Icon,
	HeartIcon,
	ShoppingCartIcon,
	ChevronDownIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';
import BrandsDropdown from '@/app/components/dropdown/brandDropdown';
import CategoriesDropdown from '@/app/components/dropdown/categoriesMainDropdown';
import { useMobileNav } from './MobileNavContext';

const BottomNavbar = () => {
	// Use global mobile drawer (TopNav) instead of a local overlay
	const { isOpen, toggle } = useMobileNav();

	const [dropdowns, setDropdowns] = useState({
		brands: false,
		categories: false,
	});
	const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

	const brandsRef = useRef<HTMLDivElement>(null);
	const categoriesRef = useRef<HTMLDivElement>(null);
	const cartQuantity = useAppSelector((state) => state.cart.totalQuantity);
	const wishlistQuantity = useAppSelector(
		(state) => state.wishlist.items.length
	);

	const handleMouseEnter = (dropdownName: 'brands' | 'categories') => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setDropdowns((prev) => ({ ...prev, [dropdownName]: true }));
	};

	const handleMouseLeave = (dropdownName: 'brands' | 'categories') => {
		const timeout = setTimeout(() => {
			setDropdowns((prev) => ({ ...prev, [dropdownName]: false }));
		}, 200);
		setCloseTimeout(timeout);
	};

	const closeAllDropdowns = () => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setDropdowns({ brands: false, categories: false });
	};

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				brandsRef.current &&
				!brandsRef.current.contains(event.target as Node) &&
				categoriesRef.current &&
				!categoriesRef.current.contains(event.target as Node)
			) {
				closeAllDropdowns();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			if (closeTimeout) {
				clearTimeout(closeTimeout);
			}
		};
	}, [closeTimeout]);

	const navItems = [
		{ href: '/', label: 'Home' },
		{ label: 'Products', href: '/products' },
		{
			label: 'Brands',
			hasDropdown: true,
			dropdownKey: 'brands' as const,
			ref: brandsRef,
		},
		{
			label: 'All Categories',
			hasDropdown: true,
			dropdownKey: 'categories' as const,
			ref: categoriesRef,
		},
		{ href: '/blog', label: 'Blog' },
		{ href: '/blog/#youtube', label: 'Youtube' },
	];

	return (
		<>
			<nav className='bg-primaryPurple p-3  sm:p-4 lg:p-5 rounded-lg flex items-center justify-between mx-2 md:mx-4 lg:mx-8.5 text-white relative'>
				{/* Mobile Menu Button */}
				<button
					onClick={toggle}
					className='lg:hidden flex items-center gap-2 p-2 rounded-md hover:bg-primaryPurple/80 transition-colors'
					aria-label='Toggle menu'
					aria-expanded={isOpen}>
					{isOpen ? (
						<XMarkIcon className='w-5 h-5 text-white' />
					) : (
						<Bars3Icon className='w-5 h-5 text-white' />
					)}
				</button>

				{/* Desktop Categories */}
				<div className='hidden lg:flex items-center gap-2'>
					<Bars3Icon className='w-5 h-5 text-white' />
					<p className='text-sm lg:text-base'>Browse Categories</p>
				</div>

				{/* Desktop Navigation */}
				<ul className='hidden lg:flex items-center gap-6 xl:gap-8'>
					{navItems.map((item, index) => (
						<li
							key={index}
							className='relative'>
							{item.href ? (
								<Link
									href={item.href}
									className='cursor-pointer text-sm xl:text-base hover:opacity-80 transition-opacity'>
									{item.label}
								</Link>
							) : (
								// Wrapper includes both button + dropdown
								<div
									ref={item.ref}
									className='relative group'
									onMouseEnter={() => handleMouseEnter(item.dropdownKey!)}
									onMouseLeave={() => handleMouseLeave(item.dropdownKey!)}>
									<div className='flex items-center gap-1.5 cursor-pointer text-sm xl:text-base hover:opacity-80 transition-opacity'>
										{item.label}
										<ChevronDownIcon
											className={`h-3 w-3 transition-transform duration-200 ${
												dropdowns[item.dropdownKey!] ? 'rotate-180' : ''
											}`}
										/>
									</div>

									{/* Invisible bridge to prevent gap issues */}
									<div className='absolute top-full left-0 w-full h-2 bg-transparent' />

									{/* Dropdowns stay inside the same wrapper */}
									{item.dropdownKey === 'brands' && (
										<BrandsDropdown
											isOpen={dropdowns.brands}
											onClose={closeAllDropdowns}
										/>
									)}
									{item.dropdownKey === 'categories' && (
										<CategoriesDropdown
											isOpen={dropdowns.categories}
											onClose={closeAllDropdowns}
										/>
									)}
								</div>
							)}
						</li>
					))}
				</ul>

				{/* Cart + Wishlist */}
				<div className='flex items-center gap-3 lg:gap-4 text-white'>
					<Link
						href='/cart'
						className='cursor-pointer relative p-1 hover:opacity-80 transition-opacity'
						aria-label='Shopping cart'>
						<div className='bg-white text-primaryPink h-4 w-4 lg:h-5 lg:w-5 items-center justify-center rounded-full text-[10px] sm:text-xs font-semibold absolute z-10 flex right-0 top-0 -translate-y-1/2 translate-x-1/2'>
							{cartQuantity}
						</div>
						<ShoppingCartIcon className='h-5 w-5 lg:h-8 lg:w-8 cursor-pointer' />
					</Link>
					<Link
						href='/wishlist'
						className='cursor-pointer relative p-1 hover:opacity-80 transition-opacity  mr-2 sm:ml-0'
						aria-label='Wishlist'>
						<div className='bg-white text-primaryPink h-4 w-4 lg:h-5 lg:w-5 items-center justify-center rounded-full text-xs font-semibold absolute z-10 flex right-0 top-0 -translate-y-1/2 translate-x-1/2'>
							{wishlistQuantity}
						</div>
						<HeartIcon className='h-5 w-5 lg:h-8 lg:w-8 cursor-pointer' />
					</Link>
				</div>
			</nav>
		</>
	);
};

export default BottomNavbar;
