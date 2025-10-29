/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

'use client';

import { useParams } from 'next/navigation';
import { Product } from '@/types/index';
import { HeartIcon } from '@heroicons/react/24/outline';
import StarRating from '@/app/components/Rating/starRating';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllProducts } from '@/services/admin';

const AdminProductsDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [allProducts, setAllProducts] = useState<Product[]>([]);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState('description');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			try {
				const data = await getAllProducts();
				const mappedProducts: Product[] = data.map((item: any) => ({
					id: item.id,
					productName: item.productName,
					imageUrl: item.imageUrl,
					originalPrice: item.productPrice,
					salePrice: item.productPrice,
					discount: item.discount,
					description: item.productDescription,
					productCategory: item.productCategory,
					cartoonQuantity: item.cartoonQuantity,
					brand: item.brand,
					rating: item.rating || 0,
					reviews: item.reviews || 0,
					ingredients: item.ingredients ?? [],
					discountDetails: item.discountDetails,
					isOutOfStock: item.isOutOfStock,
					productDescription: item.productDescription, // Add this property
					productPrice: item.productPrice, // Add this property
				}));
				setAllProducts(mappedProducts);
				const foundProduct = mappedProducts.find(
					(p) => String(p.id) === String(id)
				);
				setProduct(foundProduct ?? null);
			} catch (error: any) {
				toast.error(error?.message || 'Failed to fetch product details');
			}
			setLoading(false);
		};
		fetchProduct();
	}, [id]);

	if (loading)
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<span className='animate-spin inline-block w-8 h-8 border-2 border-t-transparent border-primaryPurple rounded-full'></span>
				<span className='ml-2 text-primaryPurple'>Loading product...</span>
			</div>
		);

	if (!product)
		return (
			<div className='flex justify-center items-center min-h-screen'>
				Product not found.
			</div>
		);

	const tabContent = {
		description: (
			<div className='p-6 bg-white rounded-lg shadow-md'>
				<h3 className='text-xl font-semibold mb-4'>Product Description</h3>
				{product.productDescription && (
					<p className='text-gray-700 leading-relaxed mt-4'>
						{product.productDescription}
					</p>
				)}
			</div>
		),
		additional: (
			<table className='w-full bg-white rounded-lg shadow-md overflow-hidden'>
				<thead>
					<tr className='bg-primaryPurple text-white!'>
						<th className='text-left py-4 px-6 font-semibold'>Attribute</th>
						<th className='text-left py-4 px-6 font-semibold'>Details</th>
					</tr>
				</thead>
				<tbody>
					<tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
						<td className='py-4 px-6 font-medium'>Skin Type</td>
						<td className='py-4 px-6'>
							Normal, Oily, Dry, Combination, Sensitive skin
						</td>
					</tr>
					<tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
						<td className='py-4 px-6 font-medium'>Size / Volume</td>
						<td className='py-4 px-6'>4 fl oz / 120 ml</td>
					</tr>
					<tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
						<td className='py-4 px-6 font-medium'>Brand Name</td>
						<td className='py-4 px-6'>{product.brand || 'Beauty Cosmetics'}</td>
					</tr>
					<tr className='hover:bg-gray-50 transition-colors'>
						<td className='py-4 px-6 font-medium'>Ingredients</td>
						<td className='py-4 px-6'>
							{Array.isArray(product.ingredients) &&
							product.ingredients.length > 0
								? product.ingredients.join(', ')
								: 'Hyaluronic Acid, Vitamin C, Aloe Vera, Green Tea Extract'}
						</td>
					</tr>
				</tbody>
			</table>
		),
		reviews: (
			<div className='p-6 bg-white rounded-lg shadow-md'>
				<h3 className='text-xl font-semibold mb-4'>Customer Reviews</h3>
				<div className='flex items-center gap-4 mb-6'>
					<div className='text-3xl font-bold text-primaryPurple'>
						{product.rating || 4.5}
					</div>
					<div>
						<StarRating
							rating={product.rating || 4.5}
							reviews={product.reviews || 120}
						/>
						<p className='text-sm text-gray-600 mt-1'>
							Based on {product.reviews || 120} reviews
						</p>
					</div>
				</div>
				{/* Example reviews */}
				<div className='space-y-4'>
					<div className='border-b border-gray-200 pb-4'>
						<div className='flex items-center gap-2 mb-2'>
							<span className='font-semibold'>Sarah M.</span>
							<StarRating
								rating={5}
								reviews={0}
							/>
						</div>
						<p className='text-gray-700'>
							Absolutely love this product! My skin has never felt better.
						</p>
					</div>
					<div className='border-b border-gray-200 pb-4'>
						<div className='flex items-center gap-2 mb-2'>
							<span className='font-semibold'>John D.</span>
							<StarRating
								rating={4}
								reviews={0}
							/>
						</div>
						<p className='text-gray-700'>
							Great product, but the scent is a bit strong for my preference.
						</p>
					</div>
				</div>
			</div>
		),
	};

	return (
		<div className='flex flex-col gap-8 row-start-2 items-center sm:items-start my-6 mx-2 md:mx-4 lg:mx-6 '>
			{/* Product Details */}
			<div className='flex flex-col lg:flex-row gap-8 lg:gap-16 w-full items-start h-full'>
				<div className='bg-white rounded-2xl p-4 lg:p-8 flex items-center justify-center shadow-md max-w-4xl flex-1'>
					{product.imageUrl ? (
						<img
							src={product.imageUrl}
							alt={product.productName}
							width={450}
							height={300}
							className='w-full max-w-sm md:max-w-lg  object-contain h-[300px] '
						/>
					) : (
						<div className='w-full h-[300px] flex items-center justify-center bg-gray-100 rounded'>
							<span className='text-gray-400'>No image available</span>
						</div>
					)}
				</div>
				<div className='flex flex-col gap-6 lg:gap-6 flex-1'>
					<div className='flex flex-col gap-2'>
						<p className='text-lg font-medium text-gray-600'>
							{product.productCategory}
						</p>
						<h1 className='font-bold text-2xl lg:text-3xl'>
							{product.productName}
						</h1>
						<StarRating
							rating={product.rating || 4.5}
							reviews={product.reviews || 120}
						/>
					</div>
					<h1 className='text-primaryPurple font-bold text-2xl lg:text-3xl'>
						₦{product.originalPrice?.toFixed(2)}
					</h1>
					<p className='text-gray-700 text-lg'>{product.productDescription}</p>

					{/* Cart + Wishlist Section */}
					<div className='flex flex-col sm:flex-row gap-4 items-center'>
						<div className='flex items-center gap-4 border border-primaryPurple rounded-lg px-4 py-2'>
							<button
								disabled={quantity <= 1}
								className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
								-
							</button>
							<span className='min-w-[20px] text-center'>{quantity}</span>
							<button className='cursor-pointer'>+</button>
						</div>
						<button className='text-sm bg-primaryPurple text-white! px-4 py-3 rounded-lg w-full sm:w-auto hover:bg-primaryPurple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
							Add to Cart
						</button>
						<button className='border border-primaryPink bg-primaryPink text-white! px-4 py-3 rounded-lg w-full sm:w-auto hover:bg-primaryPink/90 transition-colors'>
							Add to Wishlist
						</button>
						<button className='border border-primaryPurple rounded-full p-3 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors'>
							<HeartIcon className='h-5 w-5 text-primaryPurple' />
						</button>
					</div>
				</div>
			</div>

			{/* Tabs Section */}
			<div className='w-full mt-8'>
				{/* Tab Headers */}
				<div className='border-b border-gray-300 mb-6'>
					<div className='flex gap-8'>
						{[
							{ id: 'description', label: 'Description' },
							{ id: 'additional', label: 'Additional Information' },
							{ id: 'reviews', label: `Reviews (${product.reviews || 120})` },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`pb-4 px-2 font-medium transition-colors ${
									activeTab === tab.id
										? 'text-primaryPurple border-b-2 border-primaryPurple'
										: 'text-gray-500 hover:text-primaryPurple'
								}`}>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				<div className=''>
					{tabContent[activeTab as keyof typeof tabContent]}
				</div>
			</div>
		</div>
	);
};

export default AdminProductsDetails;
