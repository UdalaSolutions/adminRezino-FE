'use client';

import Image from 'next/image';

const EmptyState = ({
	title = 'No Data Available',
	message = 'There’s nothing to show here yet.',
	imageSrc = '/Icons/empty-box.svg',
	height = 70,
	width = 70,
}) => {
	return (
		<section className='w-full'>
			<div className='w-full h-18 bg-white px-6 md:px-4 rounded-t-lg' />
			<div className='bg-[#F0EBF7] flex flex-col py-10 gap-5 items-center justify-center min-h-[60vh]'>
				{/* Circle container with shimmer effect */}
				<div className='bg-white w-36 h-36 rounded-full flex items-center justify-center shadow-sm animate-pulse'>
					<Image
						src={imageSrc}
						alt='empty state'
						width={width}
						height={height}
					/>
				</div>

				<h2 className='text-lg font-bold text-[#4D597C] text-center'>
					{title}
				</h2>
				<p className='text-gray-600 font-medium text-center'>{message}</p>

				<div className='mt-4 flex items-center gap-2'>
					<span className='inline-block w-4 h-4 rounded-full bg-primaryPurple animate-bounce'></span>
					<span className='inline-block w-4 h-4 rounded-full bg-primaryPurple animate-bounce delay-200'></span>
					<span className='inline-block w-4 h-4 rounded-full bg-primaryPurple animate-bounce delay-400'></span>
				</div>
			</div>
		</section>
	);
};

export default EmptyState;
