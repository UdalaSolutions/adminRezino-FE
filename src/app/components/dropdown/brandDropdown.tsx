'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllBrands, Brand } from '@/utils/helper';

interface BrandsDropdownProps {
	isOpen: boolean;
	onClose: () => void;
}

const BrandsDropdown: React.FC<BrandsDropdownProps> = ({ isOpen, onClose }) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Fetch brands immediately on component mount (not when dropdown opens)
	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const brandsData = await getAllBrands();
				setBrands(brandsData);
			} catch (err) {
				setError('Failed to load brands');
				console.error('Error fetching brands:', err);
			}
		};

		fetchBrands();
	}, []); // Empty dependency array - runs once on mount

	if (!isOpen) return null;

	return (
		<div
			className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white  shadow-2xl border border-gray-200 w-[900px] z-50 transition-all duration-300 ${
				isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
			}`}
			onMouseLeave={onClose}>
			{/* Error */}
			{error && (
				<div className='text-center py-12 text-red-500'>
					<div className='mb-3'>
						<svg
							className='w-8 h-8 mx-auto text-red-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</div>
					<p className='font-medium'>{error}</p>
				</div>
			)}

			{/* Brands Grid */}
			{!error && (
				<div className='p-8'>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-5 gap-x-12'>
						{brands.length > 0 ? (
							brands.map((brand, idx) => (
								<Link
									key={idx}
									href={`/brands?brand=${brand.name}`}
									className='block font-bold text-gray-900 hover:text-primaryPurple text-base mb-2 transition-all duration-150'
									onClick={onClose}>
									{brand.name}
								</Link>
							))
						) : (
							<div className='col-span-5 text-center py-6'>
								<div className='w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3'>
									<svg
										className='w-6 h-6 text-gray-400'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
										/>
									</svg>
								</div>
								<p className='text-sm text-gray-500'>No brands available</p>
							</div>
						)}
					</div>
					{/* View All Brands Link */}
					<div className='mt-8 text-center'>
						<Link
							href='/brands'
							className='inline-flex items-center px-6 py-2.5 bg-primaryPurple text-white rounded-lg hover:bg-primaryPurple/90 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
							onClick={onClose}>
							View All Brands
							<svg
								className='w-4 h-4 ml-2'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 8l4 4m0 0l-4 4m4-4H3'
								/>
							</svg>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default BrandsDropdown;
