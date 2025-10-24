import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/index';

interface RecentSearchesProps {
	products: Product[];
	onSeeAll?: () => void;
}

const RelatedProducts: React.FC<RecentSearchesProps> = ({ products }) => {
	return (
		<section className='mb-8 w-full flex flex-col gap-5'>
			{/* Header */}
			<div className='flex justify-between items-center'>
				<p className='text-foreground text-xl leading-[100%] font-semibold'>
					Related Products
				</p>
			</div>

			{/* Products Grid */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
				{products.slice(0, 15).map((product) => (
					<ProductCard
						key={product.id}
						product={product}
					/>
				))}
			</div>
		</section>
	);
};

export default RelatedProducts;
