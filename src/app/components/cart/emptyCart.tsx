import Image from 'next/image';
import Link from 'next/link';

const EmptyCart = () => {
	return (
		<>
			<section>
				<div className='w-full h-18 bg-white px-6 md:px-4  rounded-t-lg' />
				<div className='bg-[#F0EBF7] flex flex-col py-2 sm:py-10 gap-5 items-center justify-center'>
					<div className='bg-white w-36 h-36 rounded-full flex items-center justify-center'>
						<Image
							src='/Icons/empty-cart.svg'
							alt='empty cart'
							width={70}
							height={70}
						/>
					</div>
					<h2 className='text-lg font-bold leading-[21px] text-[#4D597C]'>
						No Data on cart
					</h2>
					<p className='font-medium leading-[21px]'>
						Your cart is currently empty
					</p>

					<Link
						href='/'
						className='bg-primaryPurple text-white rounded-lg py-3 flex items-center justify-center px-6'>
						Shop Now
					</Link>
				</div>
			</section>
		</>
	);
};
export default EmptyCart;
