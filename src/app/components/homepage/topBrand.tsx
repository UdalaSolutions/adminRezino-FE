/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TopBrand = () => {
	const brands = [
		{
			id: 1,
			name: '',
			image: '/Homepage/topBrands/Combo-Banner-1-scaled-optimized.webp',
			color: '',
		},
		{
			id: 2,
			name: '',
			image: '/Homepage/topBrands/Stocked-Faves-Banner-1-scaled-optimized.webp',
			color: '',
		},
		{
			id: 3,
			name: '',
			image: '/Homepage/topBrands/SMD-Banner-1-scaled-optimized.webp',
			color: 'from-amber-100 to-orange-100',
		},
	];

	const NextArrow = ({ onClick }) => (
		<button
			onClick={onClick}
			className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110'
			aria-label='Next slide'>
			<ChevronRight className='w-5 h-5 md:w-6 md:h-6 text-primaryPurple' />
		</button>
	);

	const PrevArrow = ({ onClick }) => (
		<button
			onClick={onClick}
			className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110'
			aria-label='Previous slide'>
			<ChevronLeft className='w-5 h-5 md:w-6 md:h-6 text-primaryPurple' />
		</button>
	);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1, // Desktop: 3 slides
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		arrows: true,
		pauseOnHover: true,
		nextArrow: <NextArrow onClick={undefined} />,
		prevArrow: <PrevArrow onClick={undefined} />,
		responsive: [
			{
				breakpoint: 1280, // < 1280px
				settings: {
					slidesToShow: 2.5, // 2.5 slides (large tablets/small desktops)
					slidesToScroll: 1,
					arrows: true,
				},
			},
			{
				breakpoint: 1024, // < 1024px
				settings: {
					slidesToShow: 2, // 2 slides (tablets)
					slidesToScroll: 1,
					arrows: true,
				},
			},
			{
				breakpoint: 768, // < 768px
				settings: {
					slidesToShow: 1, // 1 slide (mobile)
					slidesToScroll: 1,
					arrows: true,
				},
			},
		],
	};
	return (
		<section className='w-full px-0 sm:px-4 py-4 sm:py-8'>
			<div className='carousel-container '>
				<Slider {...settings}>
					{brands.map((brand) => (
						<div
							key={brand.id}
							className='px-0 sm:px-2 md:px-4'>
							<div className='relative group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 rounded-lg'>
								<div
									className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-20`}
								/>

								<div className='relative h-56 xs:h-64 sm:h-80 md:h-[400px] min-h-[200px] overflow-hidden bg-primaryPurple/10'>
									<img
										src={brand.image}
										alt={brand.name}
										className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 object-center!'
									/>

									<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								</div>

								<div className='absolute bottom-0 left-0 right-0 p-2 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500'>
									<h3 className='text-white text-base sm:text-lg md:text-2xl font-bold mb-1 md:mb-4 drop-shadow-lg'>
										{brand.name}
									</h3>

									<Link
										href='/products'
										className='bg-primaryPurple text-white font-semibold py-2.5 px-3 sm:px-4 md:px-4.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 text-xs sm:text-sm md:text-base relative bottom-5 md:bottom-0'>
										Visit Store
									</Link>
								</div>

								<Link
									href='/products'
									className='absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
									<span className='text-primaryPurple font-semibold text-xs md:text-sm'>
										Shop Now
									</span>
								</Link>
							</div>
						</div>
					))}
				</Slider>
			</div>

			<style jsx>{`
				.carousel-container :global(.slick-dots) {
					bottom: -2rem;
				}

				@media (max-width: 768px) {
					.carousel-container :global(.slick-dots) {
						bottom: -1.5rem;
					}
				}
			`}</style>
		</section>
	);
};

export default TopBrand;
