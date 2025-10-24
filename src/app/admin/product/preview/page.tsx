'use client';

import { useState, useEffect } from 'react';
import AdminProductCard from '@/app/components/admin/productManagement/ProductCard';
import ProductNavbar from '@/app/components/navbar/productNavbar';
import ProductPagination from '@/app/components/pagination/productPagination';
import EditProductModal from '@/app/components/admin/orderManagement/EditProductModal';
import { Product } from '@/types/index';
import { getAllProducts } from '@/services/admin';

const AdminProducts = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [products, setProducts] = useState<Product[]>([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const productsPerPage = 15;

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			try {
				const data = await getAllProducts();
				setProducts(data || []);
			} catch (error) {
				console.error('Failed to fetch products:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const totalPages = Math.ceil(products.length / productsPerPage);
	const startIndex = (currentPage - 1) * productsPerPage;
	const currentProducts = products.slice(
		startIndex,
		startIndex + productsPerPage
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	// Handles edit button click from the card
	const handleEditClick = (product: Product) => {
		setEditingProduct(product);
		setIsEditModalOpen(true);
	};

	// handle product update (after modal submit)
	const handleUpdateProduct = (updatedProduct: Product) => {
		// You probably want to send updatedProduct to backend here!
		setIsEditModalOpen(false);
		setEditingProduct(null);
		// Optionally, refetch products or update local state
	};

	// handle delete (for completeness)
	const handleDeleteSingleProduct = async (productId: string | number) => {
		// Implement your delete logic here!
	};

	return (
		<>
			<section className='my-8 mx-2 md:mx-4 lg:mx-8.5'>
				<div className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start min-w-full px-1 sm:px-0'>
					<ProductNavbar
						currentPage={currentPage}
						totalPages={totalPages}
					/>

					{/* Admin Products Grid */}
					<div className='w-full'>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4'>
							{currentProducts.map((product) => (
								<AdminProductCard
									key={product.id}
									product={product}
									isLoading={isLoading}
									onEdit={handleEditClick}
									onDelete={handleDeleteSingleProduct}
								/>
							))}
						</div>
					</div>

					<ProductPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			</section>
			<EditProductModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onUpdate={handleUpdateProduct}
				product={editingProduct}
			/>
		</>
	);
};

export default AdminProducts;
