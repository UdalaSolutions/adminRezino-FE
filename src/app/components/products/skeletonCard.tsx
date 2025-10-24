const SkeletonCard = () => {
	return (
		<>
			<div className='bg-white rounded-lg border border-gray-200 py-4 px-2 animate-pulse'>
				{/* Image Skeleton */}
				<div className='relative mb-3'>
					<div className='aspect-square bg-gray-200 rounded-lg'></div>
				</div>

				{/* Rating Skeleton */}
				<div className='mb-2 h-4 bg-gray-200 rounded'></div>

				{/* Discount Badge Skeleton */}
				<div className='flex justify-between items-center my-2'>
					<div className='h-6 bg-gray-200 rounded w-20'></div>
					<div className='h-6 bg-gray-200 rounded w-16'></div>
				</div>

				{/* Title Skeleton */}
				<div className='h-4 bg-gray-200 rounded mb-2'></div>
				<div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>

				{/* Price Skeleton */}
				<div className='h-6 bg-gray-200 rounded w-16 mb-3'></div>

				{/* Buttons Skeleton */}
				<div className='flex items-end gap-2'>
					<div className='flex items-center gap-2.5'>
						<div className='flex items-center border rounded-sm border-gray-300'>
							<div className='px-2 py-1 w-6 h-6 bg-gray-200'></div>
							<div className='px-3 py-1 w-8 h-6 bg-gray-200'></div>
							<div className='px-2 py-1 w-6 h-6 bg-gray-200'></div>
						</div>
						<div className='h-8 bg-gray-200 rounded w-20'></div>
					</div>
				</div>
			</div>
		</>
	);
};
export default SkeletonCard;
