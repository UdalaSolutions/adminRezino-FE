interface ProductNavbarProps {
	currentPage: number;
	totalPages: number;
}

const ProductNavbar: React.FC<ProductNavbarProps> = ({
	currentPage,
	totalPages,
}) => {
	return (
		<>
			<div className='bg-white p-4 px-3 sm:px-5 min-w-full flex items-center justify-between mt-6 mb-3 rounded-sm shadow-md'>
				<div className='flex gap-1.5 text-sm sm:text-base'>
					<h2>Category:</h2>
					<p>Skincare</p>
				</div>
				<div className='text-sm sm:text-base'>
					<p>
						Page {currentPage} of {totalPages}
					</p>
				</div>
				<div className='flex gap-1.5 text-sm sm:text-base'>
					<h2>Sort By:</h2>
					<p>Newest</p>
				</div>
			</div>
		</>
	);
};
export default ProductNavbar;
