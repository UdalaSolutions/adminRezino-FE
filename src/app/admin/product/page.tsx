/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import {
	PencilSquareIcon,
	TrashIcon,
	ViewfinderCircleIcon as EyeIcon,
} from '@heroicons/react/24/outline';
import ProductPagination from '@/app/components/pagination/productPagination';
import AddProductModal from '@/app/components/admin/orderManagement/addProductModal';
import EditProductModal from '@/app/components/admin/orderManagement/EditProductModal';
import type { Product } from '@/types';
import { deleteProduct, getAllProducts } from '@/services/admin';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ProductManagement = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [addError, setAddError] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<{ [key: number]: boolean }>({});
	const [bulkDeleting, setBulkDeleting] = useState(false);
	const [loadingProducts, setLoadingProducts] = useState(false);

	const router = useRouter();

	const productsPerPage = 10;
	const totalPages = Math.ceil(products.length / productsPerPage);
	const startIndex = (currentPage - 1) * productsPerPage;
	const currentProducts = products.slice(
		startIndex,
		startIndex + productsPerPage
	);

	const fetchProducts = async () => {
		setLoadingProducts(true);
		try {
			const data = await getAllProducts();
			const mappedProducts: Product[] = data.map((item: any) => ({
				id: item.id,
				productName: item.productName,
				imageUrl: item.imageUrl,
				productPrice: item.productPrice,
				discount: item.discount,
				productDescription: item.productDescription,
				productCategory: item.productCategory,
				cartoonQuantity: item.cartoonQuantity,
				brand: item.brand,
				rating: item.rating ?? 0,
				reviews: item.reviews ?? 0,
				ingredients: item.ingredients ?? [],
				discountDetails: item.discountDetails,
				isOutOfStock: item.isOutOfStock,
			}));
			setProducts(mappedProducts);
		} catch (err: any) {
			toast.error(err.message || 'Failed to load products');
		} finally {
			setLoadingProducts(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const toggleProductSelection = (productId: number) => {
		setSelectedProducts((prev) =>
			prev.includes(productId)
				? prev.filter((id) => id !== productId)
				: [...prev, productId]
		);
	};

	const toggleSelectAll = () => {
		setSelectedProducts(
			selectedProducts.length === currentProducts.length
				? []
				: currentProducts.map((product) => product.id)
		);
	};

	const handleDeleteSelected = async () => {
		setBulkDeleting(true);
		const idsToDelete = selectedProducts;
		const failedProducts: string[] = [];
		let deletedCount = 0;
		let failedCount = 0;

		for (const id of idsToDelete) {
			const product = products.find((p) => p.id === id);
			if (!product) continue;
			try {
				await deleteProduct(id);
				deletedCount++;
			} catch (error: any) {
				failedCount++;
				failedProducts.push(product.productName);
				console.error(`Failed to delete product ID ${id}:`, error);
			}
		}

		setBulkDeleting(false);
		setSelectedProducts([]);
		await fetchProducts();

		if (deletedCount > 0) {
			toast.success(
				`Deleted ${deletedCount} product${deletedCount > 1 ? 's' : ''}`
			);
		}
		if (failedCount > 0) {
			toast.error(`Failed to delete: ${failedProducts.join(', ')}`);
		}
	};

	const handleAddProduct = (newProduct: Product | null, error?: string) => {
		if (newProduct) {
			fetchProducts();
			setAddError(null);
			toast.success(`Product "${newProduct.productName}" added successfully!`);
		} else if (error) {
			setAddError(error);
			toast.error(error);
		}
	};

	const handleEditClick = (product: Product) => {
		setEditingProduct(product);
		setIsEditModalOpen(true);
	};

	const handleUpdateProduct = (updatedProduct: Product) => {
		setEditingProduct(null);
		setIsEditModalOpen(false);
		fetchProducts();
		toast.success(
			`Product "${updatedProduct.productName}" updated successfully!`
		);
	};

	const handleDeleteSingleProduct = async (id: number, productName: string) => {
		setDeleting((prev) => ({ ...prev, [id]: true }));
		try {
			await deleteProduct(id);
			await fetchProducts();
			toast.success(`Deleted "${productName}"`);
		} catch (error: any) {
			toast.error(error.message || `Failed to delete "${productName}"`);
		} finally {
			setDeleting((prev) => ({ ...prev, [id]: false }));
		}
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount);

	// Discount logic
	const getDiscountedPrice = (product: Product) => {
		const discount = product.discount ?? 0;
		if (discount <= 0) return product.productPrice;
		return product.productPrice - product.productPrice * (discount / 100);
	};

	return (
		<>
			<section className='my-8 mx-2 md:mx-4 lg:mx-8.5'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
					<h1 className='text-2xl font-bold mt-2'>Product Management</h1>
					<div className='flex gap-3 '>
						<button
							onClick={() => setIsAddModalOpen(true)}
							className='bg-primaryPurple rounded-lg py-2.5 px-5 flex gap-2 items-center text-white font-medium hover:bg-primaryPurple/ transition-colors'>
							<span>+</span> Add new product
						</button>
						<button
							className='bg-transparent border border-primaryPurple rounded-lg py-2.5 px-5 flex gap-2 items-center text-primaryPurple font-medium hover:bg-purple-50 transition-colors'
							onClick={() => router.push('/admin/product/preview')}>
							Preview product
						</button>
					</div>
				</div>
				{addError && (
					<div className='text-red-600 text-sm mb-2'>{addError}</div>
				)}
				{loadingProducts ? (
					<div className='flex justify-center items-center py-12'>
						<span className='animate-spin inline-block w-8 h-8 border-2 border-t-transparent border-primaryPurple rounded-full'></span>
						<span className='ml-2 text-primaryPurple'>Loading products...</span>
					</div>
				) : (
					<div className='bg-white rounded-2xl overflow-hidden shadow mt-4 lg:mt-6'>
						{/* Desktop Table View */}
						<div className='hidden lg:block '>
							<div
								className='grid gap-4 bg-white px-6 py-6 font-medium  border-b border-gray-200 '
								style={{
									gridTemplateColumns: '60px 80px 2fr 1fr 80px 100px 120px',
								}}>
								<div className='flex items-center'>
									<input
										type='checkbox'
										checked={
											selectedProducts.length === currentProducts.length &&
											currentProducts.length > 0
										}
										onChange={toggleSelectAll}
										className='h-4 w-4 text-primaryPurple rounded focus:ring-primaryPurple'
									/>
								</div>
								<div className='text-lg font-bold'>Image</div>
								<div className='text-lg font-bold'>Product Name</div>
								<div className='text-lg font-bold'>Category</div>
								<div className='text-lg font-bold'>Stock</div>
								<div className='text-lg font-bold'>Price</div>
							</div>
							<div className='divide-y divide-gray-200'>
								{currentProducts.map((product) => (
									<div
										key={product.id}
										className='grid gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors'
										style={{
											gridTemplateColumns: '60px 80px 2fr 1fr 80px 100px 120px',
										}}>
										<div className='flex items-center'>
											<input
												type='checkbox'
												checked={selectedProducts.includes(product.id)}
												onChange={() => toggleProductSelection(product.id)}
												className='h-4 w-4 text-primaryPurple rounded focus:ring-primaryPurple'
											/>
										</div>
										<div>
											<div className='w-14 h-14 overflow-hidden rounded-lg'>
												<img
													src={product.imageUrl}
													alt={product.productName}
													height={130}
													width={130}
													className='object-cover w-full h-full'
												/>
											</div>
										</div>
										<div>
											<p className='font-medium text-[19px] line-clamp-2'>
												{product.productName}
											</p>
										</div>
										<div>
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-base '>
												{product.productCategory}
											</span>
										</div>
										<div>
											<span className='font-medium text-base'>
												{product.cartoonQuantity ?? 0}
											</span>
										</div>
										<div>
											<p className='font-medium text-base'>
												{formatCurrency(getDiscountedPrice(product))}
											</p>
											{(product.discount ?? 0) > 0 && (
												<p className='text-sm text-gray-500 line-through'>
													{formatCurrency(product.productPrice)}
												</p>
											)}
										</div>
										<div className='flex justify-center space-x-1'>
											<button
												className='p-2 text-lg hover:text-primaryPurple hover:bg-purple-50 rounded-lg transition-colors'
												onClick={() => handleEditClick(product)}
												aria-label='Edit product'>
												<PencilSquareIcon className='h-6 w-6' />
											</button>
											<button
												className='p-2 font-medium text-base hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
												onClick={() =>
													handleDeleteSingleProduct(
														product.id,
														product.productName
													)
												}
												aria-label='Delete product'
												disabled={deleting[product.id]}>
												{deleting[product.id] ? (
													<span className='animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full'></span>
												) : (
													<TrashIcon className='h-6 w-6' />
												)}
											</button>
											<button
												className='p-2 font-medium text-base hover:text-primaryPurple hover:bg-purple-50 rounded-lg transition-colors'
												aria-label='View product'
												onClick={() =>
													router.push(`/admin/product/details/${product.id}`)
												}>
												<EyeIcon className='h-6 w-6' />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
						{/* Mobile & Tablet View */}
						<div className='block lg:hidden'>
							{currentProducts.length === 0 ? (
								<div className='py-8 text-center text-gray-500'>
									No products found.
								</div>
							) : (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
									{currentProducts.map((product) => (
										<div
											key={product.id}
											className='bg-white border border-gray-200 rounded-xl p-4 shadow flex flex-col'>
											<div className='flex gap-3 items-center mb-2'>
												<img
													src={product.imageUrl}
													alt={product.productName}
													className='w-16 h-16 object-cover rounded-lg border'
												/>
												<div>
													<p className='font-bold text-base'>
														{product.productName}
													</p>
													<p className='text-xs text-gray-500'>
														{product.productCategory}
													</p>
												</div>
											</div>
											<div className='flex justify-between items-center mb-2'>
												<div>
													<span className='font-medium'>
														{formatCurrency(getDiscountedPrice(product))}
													</span>
													{(product.discount ?? 0) > 0 && (
														<span className='ml-2 text-xs text-gray-400 line-through'>
															{formatCurrency(product.productPrice)}
														</span>
													)}
												</div>
												<span className='text-xs text-gray-600'>
													Stock: {product.cartoonQuantity ?? 0}
												</span>
											</div>
											<div className='flex gap-2 pt-2'>
												<button
													className='p-2 text-lg hover:text-primaryPurple hover:bg-purple-50 rounded-lg transition-colors'
													onClick={() => handleEditClick(product)}
													aria-label='Edit product'>
													<PencilSquareIcon className='h-5 w-5' />
												</button>
												<button
													className='p-2 font-medium text-base hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
													onClick={() =>
														handleDeleteSingleProduct(
															product.id,
															product.productName
														)
													}
													aria-label='Delete product'
													disabled={deleting[product.id]}>
													{deleting[product.id] ? (
														<span className='animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full'></span>
													) : (
														<TrashIcon className='h-5 w-5' />
													)}
												</button>
												<button
													className='p-2 font-medium text-base hover:text-primaryPurple hover:bg-purple-50 rounded-lg transition-colors'
													aria-label='View product'
													onClick={() =>
														router.push(`/admin/product/details/${product.id}`)
													}>
													<EyeIcon className='h-5 w-5' />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
						{/* Pagination and Delete Selected */}
						<div className='mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 px-6 border-t border-gray-200'>
							{selectedProducts.length > 0 && (
								<button
									onClick={handleDeleteSelected}
									className='flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
									disabled={bulkDeleting || loadingProducts}>
									{bulkDeleting ? (
										<span className='animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-red-600 rounded-full'></span>
									) : (
										<TrashIcon className='h-5 w-5' />
									)}
									Delete Selected ({selectedProducts.length})
								</button>
							)}
							{selectedProducts.length === 0 && <div />}
							<div className='flex justify-end w-full sm:w-auto items-center mt-6'>
								<ProductPagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
								/>
							</div>
						</div>
					</div>
				)}
			</section>
			<AddProductModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdded={handleAddProduct}
			/>
			<EditProductModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onUpdate={handleUpdateProduct}
				product={editingProduct}
			/>
		</>
	);
};

export default ProductManagement;
