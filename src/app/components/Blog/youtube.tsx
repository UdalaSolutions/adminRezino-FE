import Image from 'next/image';
import Link from 'next/link';
import { youtubeVideos } from '@/utils/utils';

const Youtube = () => {
	return (
		<section
			className='my-12 px-4 md:px-8'
			id='youtube'>
			<h1 className='text-primaryPurple text-3xl md:text-4xl font-bold mb-8 '>
				Watch our videos on YouTube
			</h1>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
				{youtubeVideos.map((video) => (
					<div
						key={video.id}
						className='rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between'>
						<div className='h-48 md:h-56'>
							<Image
								src={video.thumbnail}
								alt={video.title}
								width={0}
								height={0}
								className='w-auto h-auto object-center'
							/>
						</div>

						<div className='bg-secondaryPink p-5 md:p-6 space-y-3'>
							<span className='inline-block px-3 py-1 text-xs font-medium bg-primaryPurple text-white rounded-full'>
								{video.category}
							</span>
							<h3 className='text-lg font-semibold line-clamp-1'>
								{video.title}
							</h3>
							<p className='text-sm text-gray-700 line-clamp-2'>
								{video.description}
							</p>
							<Link
								href={video.url}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center text-[#E60303] font-medium hover:underline mt-2'>
								<svg
									className='w-5 h-5 mr-2'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
								</svg>
								Watch Video
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Youtube;
