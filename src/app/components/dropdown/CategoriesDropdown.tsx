'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

const CategoriesDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				event.target &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		// Add event listener when dropdown is open
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		// Cleanup event listener
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const categories = [
		'Make Up',
		'Skin Care',
		'Hair Care',
		'Body Care',
		'Fragrance',
		'Personal Grooming',
		'Others',
	];

	return (
		<div
			className='relative'
			ref={dropdownRef}>
			{/* Categories Button */}
			<button
				onClick={toggleDropdown}
				className='flex md:gap-1 lg:gap-2 items-center hover:text-primaryPurple transition-colors'>
				<p className='md:text-sm/5 lg:text-base/6'>All Categories</p>
				<ChevronDownIcon
					className={`w-4 h-4 text-black font-extrabold transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					{/* Backdrop for mobile */}
					<div
						className='fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden'
						onClick={toggleDropdown}
					/>

					{/* Dropdown Content */}
					<div
						className={`
						absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50
						w-72 
						left-0 md:left-auto md:right-0
						max-h-96 overflow-y-auto
					`}>
						{/* Categories List */}
						<div className='p-2'>
							{categories.map((category, index) => (
								<button
									key={index}
									className={`
										w-full text-left px-4 py-3 rounded-lg transition-colors
										hover:bg-gray-50 hover:text-primaryPurple
										flex items-center justify-between
										${index === 1 ? 'bg-[#E7D9FF] text-primaryPurple' : 'text-gray-700'}
									`}
									onClick={() => {
										// Handle category selection
										console.log(`Selected: ${category}`);
										setIsOpen(false);
									}}>
									<span className='text-sm md:text-base font-medium'>
										{category}
									</span>
									<ChevronDownIcon className='w-4 h-4 text-black' />
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default CategoriesDropdown;
