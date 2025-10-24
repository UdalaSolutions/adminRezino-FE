'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/index';
import ProductCard from '../products/ProductCard';

// Helper to shuffle
function shuffle<T>(arr: T[]): T[] {
	const array = [...arr];
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const FlashSales: React.FC = () => {
	const { data: products = [], isLoading, isError, error } = useProducts();

	// Skeleton fallback products
	const skeletonProducts = Array.from(
		{ length: 10 },
		(_, index) =>
			({
				id: `skeleton-${index}`,
			} as unknown as Product)
	);

	// Get products with discount > 0
	const flashSaleProducts = useMemo(() => {
		const discounted = products.filter(
			(product) => typeof product.discount === 'number' && product.discount > 0
		);
		return shuffle(discounted).slice(0, 10);
	}, [products]);

	const displayProducts = isLoading ? skeletonProducts : flashSaleProducts;

	return (
		<section className='mb-8 w-full flex flex-col gap-5'>
			{/* Header */}
			<div className='flex justify-between items-center mb-3'>
				<p className='text-foreground text-xl leading-[100%] font-semibold'>
					Flash Sales
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
					Error loading flash sales: {String(error)}
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

export default FlashSales;
