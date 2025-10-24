import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/services/user';
import { getAllCategories, Category } from '@/utils/helper';
import { Product } from '@/types/index';
import ProductCard from '@/app/components/products/ProductCard';

const CategoriesDropdown = ({ isOpen, onClose }) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [currentProductIndex, setCurrentProductIndex] = useState(0);

	// Fetch data immediately on component mount (not when dropdown opens)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [categoriesData, productsData] = await Promise.all([
					getAllCategories(),
					getAllProducts(),
				]);
				setCategories(categoriesData);
				setProducts(productsData.slice(0, 8)); // Get 8 products for rotation
			} catch (err) {
				setError('Failed to load data');
				console.error('Error fetching data:', err);
			}
		};

		fetchData();
	}, []); // Empty dependency array - runs once on mount

	const handleNextProducts = () => {
		if (products.length <= 4) return;
		setCurrentProductIndex((prev) => (prev + 4) % products.length);
	};

	const visibleProducts = products.slice(
		currentProductIndex,
		currentProductIndex + 2
	);

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

			{/* Content */}
			{!error && (
				<div className='flex'>
					{/* Categories Sidebar */}
					<div className='w-72 border-r border-gray-200 p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							Shop by Category
						</h3>

						{categories.length > 0 ? (
							<ul className='space-y-1'>
								{categories.map((category) => (
									<li key={category.slug}>
										<Link
											href={`/shop?category=${category.slug}`}
											className='flex items-center px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-primaryPurple/5 hover:to-primaryPurple/10 transition-all duration-200 text-gray-700 group border border-transparent hover:border-primaryPurple/20'
											onClick={onClose}>
											<div className='w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 mr-3 group-hover:bg-primaryPurple group-hover:text-white transition-all duration-200 text-xs font-medium'>
												{category.name.charAt(0).toUpperCase()}
											</div>
											<span className='text-gray-800 group-hover:text-primaryPurple font-medium flex-1'>
												{category.name}
											</span>
											<svg
												className='w-4 h-4 text-gray-400 group-hover:text-primaryPurple opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9 5l7 7-7 7'
												/>
											</svg>
										</Link>
									</li>
								))}
							</ul>
						) : (
							<div className='text-center py-6'>
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
								<p className='text-sm text-gray-500'>No categories available</p>
							</div>
						)}

						{/* View All Categories Link */}
						<div className='mt-6 pt-4 border-t border-gray-200'>
							<Link
								href='/shop?view=categories'
								className='flex items-center justify-center w-full px-3 py-2 text-primaryPurple hover:text-white font-medium text-sm border border-primaryPurple rounded-lg hover:bg-primaryPurple transition-all duration-200'
								onClick={onClose}>
								View All Categories
								<svg
									className='w-4 h-4 ml-1'
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

					{/* Products Section */}
					<div className='flex-1 p-6'>
						<div className='flex items-center justify-between mb-6'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Featured Products
							</h3>
							<div className='flex items-center space-x-3'>
								{/* Pagination Indicators */}
								<div className='flex items-center space-x-2 text-sm text-gray-500'>
									<span className='font-medium'>
										{String(Math.floor(currentProductIndex / 4) + 1).padStart(
											2,
											'0'
										)}
									</span>
									<div className='flex space-x-1'>
										<div className='w-6 h-0.5 bg-primaryPurple rounded-full'></div>
										<div className='w-6 h-0.5 bg-gray-300 rounded-full'></div>
									</div>
									<span className='font-medium'>
										{String(Math.ceil(products.length / 4)).padStart(2, '0')}
									</span>
								</div>

								{/* Navigation Button */}
								<button
									onClick={handleNextProducts}
									className='p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 group'
									disabled={products.length <= 4}>
									<svg
										className='w-4 h-4 text-gray-400 group-hover:text-primaryPurple transition-colors duration-200'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</button>
							</div>
						</div>

						{products.length > 0 ? (
							<div className='grid grid-cols-2 gap-2 mb-6'>
								{visibleProducts.map((product) => (
									<div
										key={product.id}
										className='transform scale-90 origin-center transition-transform duration-200 hover:scale-95'>
										<ProductCard
											product={product}
											isLoading={false}
										/>
									</div>
								))}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center py-12 text-gray-500'>
								<div className='w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
									<svg
										className='w-8 h-8 text-gray-400'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
										/>
									</svg>
								</div>
								<p>No products available at the moment</p>
							</div>
						)}

						{/* View All Products Link */}
						<div className='text-center'>
							<Link
								href='/products'
								className='inline-flex items-center px-6 py-2.5 bg-primaryPurple text-white rounded-lg hover:bg-primaryPurple/90 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
								onClick={onClose}>
								View All Products
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
				</div>
			)}
		</div>
	);
};

export default CategoriesDropdown;
