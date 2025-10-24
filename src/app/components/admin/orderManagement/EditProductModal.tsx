/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { editProduct, ProductApiPayload, getAllBrands } from '@/services/admin';
import { uploadImageToCloudinary } from '@/cloudinaryUpload';
import type { Product } from '@/types';
import { toast } from 'react-toastify';

export interface EditProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (product: Product | null) => void;
	product: Product | null;
}

const DEFAULT_FORM: ProductApiPayload = {
	productName: '',
	productDescription: '',
	productPrice: 0,
	productCategory: '',
	cartoonQuantity: 0,
	imageUrl: '',
	discount: 0,
	brand: '',
};

const categories = [
	'Cleanser',
	'Moisturizer',
	'Serum',
	'Sunscreen',
	'Treatment',
	'Mask',
	'PersonalGrooming',
];

const EditProductModal: React.FC<EditProductModalProps> = ({
	isOpen,
	onClose,
	onUpdate,
	product,
}) => {
	const [formData, setFormData] = useState<ProductApiPayload>(DEFAULT_FORM);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showMore, setShowMore] = useState(false);

	// Fetch brands from API
	const [brands, setBrands] = useState<string[]>([]);
	useEffect(() => {
		async function fetchBrands() {
			try {
				const allBrands = await getAllBrands();
				setBrands(allBrands);
			} catch (e: any) {
				setBrands([]);
				toast.error(e.message || 'Failed to load brands');
			}
		}
		fetchBrands();
	}, []);

	// Populate formData when modal opens or product changes
	useEffect(() => {
		if (product) {
			setFormData({
				productName: product.productName ?? '',
				productDescription: product.productDescription ?? '', // FIXED KEY
				productPrice:
					product.productPrice ??
					product.salePrice ??
					product.originalPrice ??
					0,
				productCategory: product.productCategory ?? '',
				cartoonQuantity: product.cartoonQuantity ?? 0,
				imageUrl: product.imageUrl ?? '',
				discount: product.discount ?? 0,
				brand: product.brand ?? '',
			});
			setImagePreview(product.imageUrl ?? '');
		}
	}, [product, isOpen]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === 'productPrice' ||
				name === 'cartoonQuantity' ||
				name === 'discount'
					? Number(value)
					: value,
		}));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImageUploading(true);
		setError(null);

		const reader = new FileReader();
		reader.onload = (ev) => setImagePreview(ev.target?.result as string);
		reader.readAsDataURL(file);

		try {
			const url = await uploadImageToCloudinary(file);
			setFormData((prev) => ({ ...prev, imageUrl: url }));
			toast.success('Image uploaded successfully');
		} catch (err: any) {
			setError(err.message || 'Image upload failed');
			toast.error(err.message || 'Image upload failed');
		} finally {
			setImageUploading(false);
		}
	};

	const validateForm = (): string | null => {
		if (!formData.productName.trim()) return 'Product name is required.';
		if (!formData.productCategory) return 'Product category is required.';
		if (!formData.productPrice || formData.productPrice <= 0)
			return 'Price must be greater than 0.';
		if (!formData.cartoonQuantity || formData.cartoonQuantity < 0)
			return 'Quantity cannot be negative.';
		if (!formData.imageUrl) return 'Product image is required.';
		if (showMore && !formData.brand) return 'Product brand is required.';
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			toast.error(validationError);
			return;
		}
		setIsLoading(true);
		try {
			if (!product) return;
			const payload = {
				id: product.id,
				...formData,
			};
			const updated = await editProduct(payload);
			const updatedProduct: Product = {
				id: updated.id ?? product.id,
				rating: product.rating ?? 0,
				reviews: product.reviews ?? 0,
				productPrice: formData.productPrice,
				discount: formData.discount || 0,
				productDescription: formData.productDescription,
				brand: formData.brand,
				productName: formData.productName,
				productCategory: formData.productCategory,
				imageUrl: formData.imageUrl,
				cartoonQuantity: formData.cartoonQuantity,
			};
			onUpdate(updatedProduct);
			setImagePreview(null);
			toast.success('Product updated successfully!');
			onClose();
		} catch (err: any) {
			const msg = err.message || 'Error updating product';
			setError(msg);
			toast.error(msg);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen || !product) return null;

	return (
		<div className='fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
			<div className='bg-white rounded-2xl w-full max-w-lg mx-auto overflow-hidden shadow-xl'>
				<div className='flex justify-end items-center p-2 '>
					<button
						onClick={onClose}
						className='p-2 hover:bg-gray-100 rounded-full transition-colors'
						aria-label='Close modal'
						disabled={isLoading || imageUploading}>
						<XMarkIcon className='h-6 w-6' />
					</button>
				</div>
				<form
					onSubmit={handleSubmit}
					className='p-6 space-y-6'>
					{/* Image Upload */}
					<div className='flex flex-col items-center space-y-3'>
						<div className='relative w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden'>
							{imagePreview ? (
								<img
									src={imagePreview}
									alt='Product preview'
									width={128}
									height={128}
									className='w-full h-full object-cover rounded-lg'
								/>
							) : (
								<div className='mx-auto '>
									<img
										src='/Admin/img-preview.svg'
										alt='upload'
										width={128}
										height={128}
										className='w-full h-full object-cover rounded-lg'
									/>
								</div>
							)}
						</div>
						<label className='cursor-pointer'>
							<span className='text-primaryPurple text-lg font-medium '>
								Upload Image
							</span>
							<input
								type='file'
								accept='image/*'
								onChange={handleImageUpload}
								className='hidden'
								disabled={isLoading || imageUploading}
							/>
						</label>
					</div>
					{/* Product Fields */}
					<div className='grid grid-cols-1 gap-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>Name *</label>
							<input
								type='text'
								name='productName'
								value={formData.productName}
								onChange={handleInputChange}
								required
								className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none '
								placeholder='Enter product name'
								disabled={isLoading}
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>
								Category *
							</label>
							<select
								name='productCategory'
								value={formData.productCategory}
								onChange={handleInputChange}
								required
								className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none '
								disabled={isLoading}>
								<option value=''>Select category</option>
								{categories.map((cat) => (
									<option
										key={cat}
										value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>Price *</label>
							<input
								type='number'
								name='productPrice'
								value={formData.productPrice}
								onChange={handleInputChange}
								required
								className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none'
								placeholder='0.00'
								disabled={isLoading}
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>
								Quantity *
							</label>
							<input
								type='number'
								name='cartoonQuantity'
								value={formData.cartoonQuantity}
								onChange={handleInputChange}
								required
								min='0'
								className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none'
								placeholder='Enter quantity'
								disabled={isLoading}
							/>
						</div>
						<div className='sm:col-span-2'>
							<label className='block text-sm font-medium mb-2'>
								Description
							</label>
							<textarea
								name='productDescription'
								value={formData.productDescription}
								onChange={handleInputChange}
								className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none resize-none'
								placeholder='Enter product description'
								rows={1}
								disabled={isLoading}
							/>
						</div>
						{/* Add More Details Fields */}
						{showMore && (
							<>
								<div>
									<label className='block text-sm font-medium mb-2'>
										Brand *
									</label>
									<select
										name='brand'
										value={formData.brand}
										onChange={handleInputChange}
										required
										className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none '
										disabled={isLoading}>
										<option value=''>Select brand</option>
										{brands.map((brand) => (
											<option
												key={brand}
												value={brand}>
												{brand}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className='block text-sm font-medium mb-2'>
										Discount (%)
									</label>
									<input
										type='number'
										name='discount'
										value={formData.discount}
										onChange={handleInputChange}
										min='0'
										max='100'
										className='w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-primaryPurple focus:border-transparent bg-background outline-none '
										placeholder='Enter discount'
										disabled={isLoading}
									/>
								</div>
							</>
						)}
					</div>
					<div className='flex justify-between items-center mt-4'>
						<button
							type='button'
							className='flex items-center gap-2 text-primaryPurple cursor-pointer hover:underline text-sm font-medium'
							onClick={() => setShowMore((v) => !v)}
							tabIndex={0}>
							<PlusIcon className='h-5 w-5' />
							{showMore ? 'Hide details' : 'Add more details'}
						</button>
						<div className='flex justify-end gap-4 pt-2'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
								disabled={isLoading || imageUploading}>
								Cancel
							</button>
							<button
								type='submit'
								className='px-6 py-2 bg-primaryPurple text-white rounded-lg hover:bg-purple-700 transition-colors'
								disabled={isLoading || imageUploading}>
								{isLoading ? 'Saving...' : 'Update Product'}
							</button>
						</div>
					</div>
					{error && <div className='text-red-600 text-sm mt-2'>{error}</div>}
				</form>
			</div>
		</div>
	);
};

export default EditProductModal;
