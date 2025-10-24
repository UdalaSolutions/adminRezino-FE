interface ProductPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const renderPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		// Always show first and last pages
		if (totalPages <= maxVisible + 2) {
			// If total pages are small, just show all
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			// Determine start and end pages dynamically
			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			if (currentPage <= 3) {
				start = 2;
				end = 4;
			} else if (currentPage >= totalPages - 2) {
				start = totalPages - 3;
				end = totalPages - 1;
			}

			pages.push(1);

			if (start > 2) pages.push('...');

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (end < totalPages - 1) pages.push('...');

			pages.push(totalPages);
		}

		return pages.map((page, idx) => {
			if (page === '...') {
				return (
					<span
						key={`ellipsis-${idx}`}
						className='px-2 text-gray-400'>
						...
					</span>
				);
			}

			return (
				<button
					key={page}
					onClick={() => onPageChange(page as number)}
					className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium transition-colors ${
						currentPage === page
							? 'bg-primaryPurple text-white'
							: 'bg-background text-black hover:bg-gray-100'
					}`}>
					{page}
				</button>
			);
		});
	};

	return (
		<div className='max-w-max mx-auto'>
			<div className='flex justify-center items-center mt-0 mb-12 bg-white rounded-[9px] gap-5.5 p-4 shadow-md'>
				<nav className='flex items-center gap-2'>
					{/* Previous button */}
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className='px-3 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'
							/>
						</svg>
					</button>

					{/* Page numbers */}
					<span className='flex items-center gap-2'>{renderPageNumbers()}</span>

					{/* Next button */}
					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className='px-3 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'
							/>
						</svg>
					</button>
				</nav>
			</div>
		</div>
	);
};

export default ProductPagination;
