/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import StarRating from '@/app/components/Rating/starRating';
import { Product } from '@/types/index';
import SkeletonCard from '@/app/components/products/skeletonCard';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface AdminProductCardProps {
	product: Product;
	isLoading?: boolean;
	onEdit?: (product: Product) => void;
	onDelete?: (productId: string | number) => void;
}

const AdminProductCard: React.FC<AdminProductCardProps> = ({
	product,
	isLoading = false,
	onEdit,
	onDelete,
}) => {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleCardClick = () => {
		if (isLoading) return;
		router.push(`/admin/product/details/${product.id}`);
	};

	const handleEdit = () => {
		if (isLoading) return;
		if (onEdit) onEdit(product);
	};

	const handleDelete = async () => {
		if (isLoading) return;
		if (!onDelete) return;

		setIsDeleting(true);

		try {
			await onDelete(product.id);
			toast.success('Product deleted!');
		} catch (error) {
			console.error(error);
			toast.error('Failed to delete product');
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return <SkeletonCard />;
	}

	return (
		<div
			className={`bg-white rounded-lg border border-gray-200 py-4 px-2 hover:shadow-md transition-shadow ${
				isDeleting ? 'opacity-75' : ''
			}`}>
			{/* Product Image */}
			<div
				className='relative mb-3 cursor-pointer'
				onClick={handleCardClick}>
				<div className='aspect-square overflow-hidden'>
					<img
						src={product.imageUrl}
						alt={product.productName || 'Product Image'}
						width={200}
						height={200}
						className='w-full h-full object-cover'
					/>
				</div>
				{/* Out of Stock Badge */}
				{product.isOutOfStock && (
					<div className='absolute top-2 right-0 bg-primaryRed text-white text-xs px-2 py-1 rounded-tl-sm rounded-bl-sm'>
						Out of stock
					</div>
				)}
			</div>

			{/* Star Rating */}
			<div className='mb-2'>
				<StarRating
					rating={product.rating ?? 0}
					reviews={product.reviews ?? 0}
				/>
			</div>

			{/* Discount Badge */}
			{product.discountDetails && (
				<div className='flex justify-between items-center my-2'>
					<span className='bg-primaryPurple text-white p-3 rounded-lg gap-2.5 text-[10px]'>
						Buy 3, Get 5% Off
					</span>
					{product.discountDetails !== 'Buy 3, Get 10% Off' && (
						<span className='bg-white border border-primaryPurple text-foreground text-[10px] px-2 py-3 rounded-lg'>
							{product.discountDetails}
						</span>
					)}
				</div>
			)}

			{/* Product Title */}
			<h3 className='text-sm font-medium text-foreground mb-2 line-clamp-2'>
				{product.productName}
			</h3>

			{/* Price */}
			<div className='text-base md:text-lg font-semibold text-primaryPurple mb-1.5 md:mb-3'>
				₦{product.productPrice.toLocaleString()}
			</div>

			{/* Admin Action Buttons */}
			<div className='flex gap-2 mt-3'>
				<button
					type='button'
					className='bg-primaryPurple text-white px-3 py-1 rounded text-sm font-bold transition-colors hover:bg-primaryPurple/80'
					onClick={handleEdit}
					disabled={isDeleting}>
					Edit
				</button>
				<button
					type='button'
					className='bg-primaryRed text-white px-3 py-1 rounded text-sm font-bold transition-colors hover:bg-primaryRed/80 disabled:opacity-50'
					onClick={handleDelete}
					disabled={isDeleting}>
					{isDeleting ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	);
};

export default AdminProductCard;
