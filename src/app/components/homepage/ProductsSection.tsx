import Link from 'next/link';
import ProductCard from '../products/ProductCard';
import { Product } from '@/types/index';
import { useProducts } from '@/hooks/useProducts';

const ProductsSection: React.FC = () => {
	const { data: products = [], isLoading, isError, error } = useProducts();

	// Skeleton products for loading state
	const skeletonProducts = Array.from(
		{ length: 15 },
		(_, index) =>
			({
				id: `skeleton-${index}`,
			} as unknown as Product)
	);

	// Display skeletons if loading, otherwise products
	const displayProducts = isLoading ? skeletonProducts : products;

	return (
		<section className='mb-8 w-full'>
			{/* Header */}
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-semibold text-gray-900'>Products</h2>
				<Link
					href='/products'
					className='text-base leading-[100%] text-purple-600 underline underline-offset-1 font-semibold hover:text-purple-700 transition-colors'>
					See All
				</Link>
			</div>

			{/* Error State */}
			{isError && (
				<div className='text-red-600 mb-4'>
					Error loading products: {String(error)}
				</div>
			)}

			{/* Products Grid */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4'>
				{displayProducts.slice(0, 15).map((product) => (
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

export default ProductsSection;
