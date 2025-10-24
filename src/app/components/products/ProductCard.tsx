/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import StarRating from '../Rating/starRating';
import { Product } from '@/types/index';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart } from '@/store/slices/cartSlice';
import {
	addToWishlist,
	removeFromWishlist,
} from '@/store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { formatPrice } from '@/utils/helper';
import SkeletonCard from './skeletonCard';

interface ProductCardProps {
	product: Product;
	isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	isLoading = false,
}) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	// Use redux wishlist state
	const wishlistItems = useAppSelector((state) => state.wishlist.items);
	const isWishlisted = wishlistItems.some((item) => item.id === product.id);

	const handleCardClick = () => {
		if (isLoading) return;
		router.push(`/products/details/${product.id}`);
	};

	const handleDecrease = () => {
		if (isLoading) return;
		if (quantity > 1) setQuantity(quantity - 1);
	};

	const handleIncrease = () => {
		if (isLoading) return;
		setQuantity(quantity + 1);
	};

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isLoading || product.isOutOfStock) return;

		setIsAddingToCart(true);

		try {
			dispatch(
				addToCart({
					id: String(product.id),
					productName: product.productName,
					imageUrl: product.imageUrl,
					price: product.productPrice,
					productCategory: product.productCategory,
					quantity: quantity,
				})
			);

			toast.success(
				`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`
			);

			setQuantity(1);
		} catch (error) {
			console.error(error);
			toast.error('Failed to add item to cart');
		} finally {
			setIsAddingToCart(false);
		}
	};

	const handleWishlistToggle = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isWishlisted) {
			dispatch(removeFromWishlist(product.id));
			toast.success('Removed from wishlist');
		} else {
			dispatch(
				addToWishlist({
					id: String(product.id),
					productName: product.productName,
					imageUrl: product.imageUrl,
					price: product.productPrice,
					productCategory: product.productCategory,
					quantity: 1, // Wishlist can default to 1
				})
			);
			toast.success('Added to wishlist');
		}
	};

	// Calculate discounted price if discount exists
	const discountedPrice =
		product.discount > 0
			? product.productPrice * (1 - product.discount / 100)
			: product.productPrice;

	const hasDiscount = product.discount > 0;

	// Skeleton Loading State
	if (isLoading) {
		return <SkeletonCard />;
	}

	return (
		<div
			className={`bg-white rounded-lg border border-gray-200 py-4 px-2 transition-all duration-300 ${
				isAddingToCart ? 'opacity-75' : ''
			} ${
				isHovered
					? 'shadow-lg border-primaryPurple/20 transform -translate-y-1'
					: 'hover:shadow-md'
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			{/* Product Image */}
			<div
				className='relative mb-3 cursor-pointer group'
				onClick={handleCardClick}>
				<div className='aspect-square overflow-hidden rounded-md'>
					<img
						src={product.imageUrl}
						alt={product.productName}
						width={200}
						height={200}
						className={`w-full h-full object-cover transition-transform duration-300 ${
							isHovered ? 'scale-105' : ''
						}`}
					/>
				</div>

				{/* Hover Overlay */}
				<div
					className={`absolute inset-0 bg-black/40 rounded-md flex items-center justify-center transition-opacity duration-300 ${
						isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
					}`}>
					<button
						onClick={handleWishlistToggle}
						className='bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors duration-200 transform hover:scale-110'
						aria-label={
							isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
						}>
						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill={isWishlisted ? '#ef4444' : 'none'}
							stroke={isWishlisted ? '#ef4444' : '#374151'}
							strokeWidth='2'
							className='transition-colors duration-200'>
							<path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
						</svg>
					</button>
				</div>

				{/* Out of Stock Badge */}
				{product.isOutOfStock && (
					<div className='absolute top-2 right-0 bg-primaryRed text-white text-xs px-2 py-1 rounded-tl-sm rounded-bl-sm'>
						Out of stock
					</div>
				)}

				{/* Discount Badge */}
				{hasDiscount && (
					<div className='absolute top-2 left-2 bg-primaryRed text-white text-xs px-2 py-1 rounded'>
						{product.discount}% OFF
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

			{/* Discount Details */}
			{product.discountDetails && (
				<div className='flex justify-between items-center my-2'>
					<span className='bg-primaryPurple text-white p-3 rounded-lg gap-2.5 text-[10px]'>
						{product.discountDetails}
					</span>
				</div>
			)}

			{/* Product Title */}
			<h3
				className={`text-sm font-medium text-foreground mb-2 line-clamp-2 transition-colors duration-200 ${
					isHovered ? 'text-primaryPurple' : ''
				}`}>
				{product.productName}
			</h3>

			{/* Brand */}
			{product.brand && (
				<p className='text-xs text-gray-500 mb-2'>By {product.brand}</p>
			)}

			{/* Price */}
			<div className='mb-1.5 md:mb-3'>
				{hasDiscount ? (
					<div className='flex items-center gap-2'>
						<span className='text-base md:text-lg font-semibold text-primaryPurple'>
							₦{formatPrice(discountedPrice)}
						</span>
						<span className='text-sm text-gray-500 line-through'>
							₦{formatPrice(product.productPrice)}
						</span>
					</div>
				) : (
					<div className='text-base md:text-lg font-semibold text-primaryPurple'>
						₦{formatPrice(product.productPrice)}
					</div>
				)}
			</div>

			{/* Stock Info */}
			{product.cartoonQuantity && product.cartoonQuantity > 0 && (
				<p className='text-xs text-gray-600 mb-2'>
					{product.cartoonQuantity} in stock
				</p>
			)}

			{/* Action Buttons */}
			<div className='flex items-end gap-2'>
				{/* Quantity Selector */}
				<div className='flex flex-col-reverse items-start sm:flex-row sm:items-center gap-2.5'>
					<div
						className={`flex items-center border rounded-sm border-primaryPurple transition-colors duration-200 ${
							isHovered ? 'border-primaryPurple/60 bg-primaryPurple/5' : ''
						}`}>
						<button
							type='button'
							className='px-2 py-1 text-gray-600 hover:bg-primaryPurple/10 transition-colors disabled:opacity-50'
							aria-label='Decrease quantity'
							onClick={handleDecrease}
							disabled={quantity <= 1 || isAddingToCart}>
							-
						</button>
						<span className='px-3 py-1 text-sm'>{quantity}</span>
						<button
							type='button'
							className='px-2 py-1 text-gray-600 hover:bg-primaryPurple/10 transition-colors disabled:opacity-50'
							aria-label='Increase quantity'
							onClick={handleIncrease}
							disabled={product.isOutOfStock || isAddingToCart}>
							+
						</button>
					</div>

					<button
						type='button'
						className={`text-primaryPurple underline underline-offset-1.5 sm:px-3 py-1 rounded text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
							isHovered ? 'text-primaryPurple/80 transform scale-105' : ''
						} hover:bg-primaryPurple/10`}
						onClick={handleAddToCart}
						disabled={product.isOutOfStock || isAddingToCart}>
						{isAddingToCart ? 'Adding...' : 'Add To Cart'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
