'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '../products/ProductCard';
import { Product } from '@/types/index';
import { useProducts } from '@/hooks/useProducts';

// Helper to shuffle array
function shuffle<T>(arr: T[]): T[] {
	const array = [...arr];
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const RecentSearches: React.FC = () => {
	const { data: products = [], isLoading, isError, error } = useProducts();

	// Create skeleton products for loading state
	const skeletonProducts = Array.from(
		{ length: 5 },
		(_, index) =>
			({
				id: `skeleton-${index}`,
			} as unknown as Product)
	);

	const displayProducts = isLoading
		? skeletonProducts
		: shuffle(products).slice(0, 5);

	return (
		<section className='mb-8 w-full flex flex-col gap-5'>
			{/* Header */}
			<div className='flex justify-between items-center mb-3'>
				<p className='text-foreground text-xl leading-[100%] font-semibold'>
					Recent Search
				</p>
				{!isLoading && (
					<Link
						href='#'
						className='text-base leading-[100%] text-purple-600 underline underline-offset-1 font-semibold hover:text-purple-700 transition-colors'>
						See All
					</Link>
				)}
			</div>

			{/* Error State */}
			{isError && (
				<div className='text-red-600 mb-4'>
					Error loading products: {String(error)}
				</div>
			)}

			{/* Products Grid */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
				{displayProducts.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						isLoading={isLoading}
					/>
				))}
			</div>
		</section>
	);
};

export default RecentSearches;
