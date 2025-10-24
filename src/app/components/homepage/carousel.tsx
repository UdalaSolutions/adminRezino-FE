import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { carouselData } from '@/utils/utils';

const Carousel = () => {
	// Slick settings
	const settings = {
		dots: true,
		adaptiveHeight: true,
		arrow: false,
		infinite: true,
		speed: 900,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 1700,
		pauseOnHover: true,
		arrows: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: true,
				},
			},
		],
	};

	return (
		<div className='my-4 w-full'>
			<Slider {...settings}>
				{carouselData.map((slide) => (
					<div
						key={slide.id}
						className='outline-none'>
						<div className='relative h-[200px] sm:h-[388px] md:h-[400px] bg-cover bg-center rounded-lg flex items-center overflow-hidden'>
							<div className=''>
								<div
									className='absolute inset-0 w-full bg-cover bg-center'
									style={{
										backgroundImage: `url('${slide.backgroundImage}')`,
									}}
								/>
								{/* Image slide content */}
								<div className='relative z-10 max-w-4xl px-4 sm:px-6 lg:px-8 text-left flex flex-col justify-center gap-3.5'>
									{slide.subtitle && (
										<p className='text-sm sm:text-base md:text-lg leading-[100%] text-foreground'>
											{slide.subtitle}{' '}
											<span className='text-primaryPurple'>
												{slide.highlightText}
											</span>{' '}
											{slide.subtitleEnd}
										</p>
									)}
									<h1 className='text-xl sm:text-3xl md:text-[44px] text-shadow-md text-shadow-primaryPurple font-bold text-foreground mb-4 md:mb-9'>
										{slide.title}
									</h1>
									<Link
										href={slide.buttonAction}
										className='bg-primaryPurple hover:bg-primaryPurple/90 text-white rounded-lg py-3 px-3 sm:px-6 gap-2.5 w-max cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg'>
										{slide.buttonText}
									</Link>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default Carousel;
