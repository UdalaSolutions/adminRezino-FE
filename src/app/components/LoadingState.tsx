'use client';

const LoadingState = () => {
	return (
		<section className='w-full mx-2 md:mx-4 lg:mx-8.5'>
			<div className='h-18 bg-white px-6 md:px-4 rounded-t-lg' />
			<div className='bg-[#F0EBF7] flex flex-col py-10 items-center justify-center min-h-[60vh] gap-6'>
				{/* Circle skeleton */}
				<div className='bg-white w-36 h-36 rounded-full flex items-center justify-center shadow-sm animate-pulse'>
					<div className='w-20 h-20 bg-[#E6DDF2] rounded-full'></div>
				</div>

				{/* Text skeletons */}
				<div className='flex flex-col items-center gap-3 w-64'>
					<div className='h-4 w-40 bg-[#E6DDF2] rounded-md animate-pulse'></div>
					<div className='h-4 w-32 bg-[#E6DDF2] rounded-md animate-pulse'></div>
				</div>

				{/* Button skeleton */}
				<div className='w-32 h-10 bg-primaryPurple/50 rounded-lg animate-pulse'></div>
			</div>
		</section>
	);
};

export default LoadingState;
