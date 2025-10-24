/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Check, ChevronDown } from 'lucide-react';

const WhyShopSection = () => {
	const partners = [
		{
			id: 1,
			name: 'Acwell',
			logo: '/Homepage/topBrands/Acwell-Logo-optimized.webp',
		},
		{
			id: 2,
			name: 'Face Facts',
			logo: '/Homepage/topBrands/Asset-2-scaled-optimized.webp',
		},
		{
			id: 3,
			name: 'La Roche Posay',
			logo: '/Homepage/topBrands/cropped-Logo-Simple-optimized.webp',
		},
		{
			id: 4,
			name: 'Simple',
			logo: '/Homepage/topBrands/Dove-logo-scaled-optimized.webp',
		},
		{
			id: 5,
			name: 'Palmers',
			logo: '/Homepage/topBrands/Eucerin-Logo-scaled-optimized.webp',
		},
		{
			id: 6,
			name: 'Dove',
			logo: '/Homepage/topBrands/LRP-Logo-scaled-optimized.webp',
		},
		{
			id: 7,
			name: 'Vaseline',
			logo: '/Homepage/topBrands/Skin-Aqua-Logo-scaled-optimized.webp',
		},
		{
			id: 8,
			name: 'Neutrogena',
			logo: '/Homepage/topBrands/Palmers-logo-optimized.webp',
		},
	];

	const sliderSettings = {
		dots: false,
		infinite: true,
		speed: 2000,
		slidesToShow: 6,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		cssEase: 'linear',
		pauseOnHover: true,
		arrows: false,
		responsive: [
			{
				breakpoint: 1280,
				settings: { slidesToShow: 5 },
			},
			{
				breakpoint: 1024,
				settings: { slidesToShow: 4 },
			},
			{
				breakpoint: 768,
				settings: { slidesToShow: 2, speed: 1500 },
			},
			{
				breakpoint: 480,
				settings: { slidesToShow: 1, speed: 1000 },
			},
		],
		customPaging: () => (
			<button className='w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300' />
		),
	};

	const features = [
		'Affordable everyday prices',
		'Original products from top brands',
		'Same day delivery across major locations',
		'Chat with a skincare expert anytime',
	];

	return (
		<section className='w-full pt-0 sm:py-6 md:py-8'>
			<div>
				{/* Collapsible Section (Desktop only) */}
				<details
					className='hidden md:block shadow-lg border border-gray-200 mb-12 md:mb-16 group'
					open>
					<summary className='flex items-start sm:items-center justify-between p-6 md:p-8 cursor-pointer list-none bg-white transition-colors duration-300'>
						<h2 className='text-lg sm:text-2xl font-bold text-gray-900'>
							Rezino Skincare - Nigeria&apos;s No. 1 Skincare Store
						</h2>
						<ChevronDown className='w-6 h-6 text-gray-600 transition-transform duration-300 group-open:rotate-180' />
					</summary>

					<div className='px-6 md:px-8 pb-6 md:pb-8 border-t border-gray-200'>
						<div className='grid md:grid-cols-2 gap-8 md:gap-12 pt-6 md:pt-8'>
							{/* Left Column - Why Shop */}
							<div>
								<h3 className='text-base sm:text-lg font-bold text-white bg-primaryPurple inline-block px-3 py-2 rounded-md mb-6'>
									Why Shop at Rezino?
								</h3>
								<div className='space-y-5'>
									{features.map((feature, idx) => (
										<div
											key={feature}
											className='flex items-center gap-2 sm:gap-4'>
											<div
												className={`flex-shrink-0 ${
													idx === 3 ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6'
												} bg-primaryPurple rounded-full flex items-center justify-center mt-1`}>
												<Check
													className={`${
														idx === 3 ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-4 h-4'
													} text-white`}
												/>
											</div>
											<p
												className={`${
													idx === 3
														? 'text-sm sm:text-base md:text-lg'
														: 'text-base md:text-lg'
												} leading-relaxed`}>
												<strong className='font-semibold'>{feature}</strong>
											</p>
										</div>
									))}
								</div>
							</div>
							{/* Right Column - Promise */}
							<div>
								<h3 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-6'>
									Our Promise to You
								</h3>
								<p className='text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed'>
									We&apos;ve helped thousands of Nigerians achieve their
									skincare goals with affordable, dermatologist-approved
									products—no stress, no fake products. Whether you&apos;re just
									starting your skincare journey or looking to perfect your
									routine, our expertly curated selection ensures you get real
									results with authentic products, every time. Join our growing
									community and experience the confidence that comes from
									healthy, glowing skin—backed by trusted brands and expert
									advice, delivered right to your door.
								</p>
							</div>
						</div>
					</div>
				</details>

				{/* Partners Carousel Section - Now visible on all devices */}
				<div className='pt-6 sm:pt-6'>
					<h3 className='text-base sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12'>
						Shop for Affordable Skincare on Rezino Skincare
					</h3>
					<div>
						<Slider {...sliderSettings}>
							{partners.map((partner) => (
								<div
									key={partner.id}
									className='px-4'>
									<div className='p-4 sm:p-6 h-24 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer'>
										<img
											src={partner.logo}
											alt={partner.name}
											className='max-w-full max-h-full object-contain hover:grayscale-0 transition-all duration-300'
										/>
									</div>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyShopSection;
