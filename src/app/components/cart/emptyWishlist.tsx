import Image from 'next/image';
import Link from 'next/link';

const EmptyWishlist = () => {
	return (
		<section className='min-h-[60vh] flex flex-col items-center justify-center bg-[#F0EBF7] w-full my-4 md:my-7'>
			<div className='bg-white w-36 h-36 rounded-full flex items-center justify-center shadow mb-6'>
				<Image
					src='/Icons/empty-cart.svg'
					alt='empty cart'
					width={70}
					height={70}
				/>
			</div>
			<h2 className='text-xl font-bold text-[#4D597C] mb-2'>
				No Data on wishlist
			</h2>
			<p className='font-medium text-gray-600 mb-6'>
				Your wishlist is currently empty
			</p>
			<Link
				href='/'
				className='bg-primaryPurple text-white rounded-lg py-3 px-6 font-semibold shadow hover:bg-primaryPurple/80 transition'>
				Shop Now
			</Link>
		</section>
	);
};
export default EmptyWishlist;
