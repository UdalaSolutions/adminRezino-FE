import Image from 'next/image';
import { collections } from '@/utils/utils';

const Collections = () => {
	return (
		<section className='w-full flex flex-col gap-5'>
			<div className='flex justify-between items-center'>
				<p className='text-foreground not-only-of-type:text-xl leading-[100%] text-shadow-xs text-shadow-foreground'>
					Collections
				</p>
				<a
					href='#'
					className='text-base leading-[100%] text-primaryPurple underline underline-offset-1 font-semibold'>
					See All
				</a>
			</div>
			<div className='grid grid-cols sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{collections.map((collection) => (
					<div
						key={collection.id}
						className={`${collection.bgColor} rounded-lg p-6 flex flex-col gap-4 justify-center items-center`}>
						<Image
							src={collection.image}
							alt={collection.name.toLowerCase()}
							width={240}
							height={240}
						/>
						<div className='py-3 px-6 w-full flex items-center justify-center rounded-lg border border-primaryPurple gap-2.5 text-lg/[100%]'>
							{collection.name}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Collections;
