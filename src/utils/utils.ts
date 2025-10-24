import { Product } from '@/types/index';

export interface Collection {
	id: number;
	name: string;
	image: string;
	bgColor: string;
}

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterSection {
	title: string;
	links: FooterLink[];
}

export interface SocialLink {
	platform: 'facebook' | 'instagram' | 'twitter' | 'youtube';
	href: string;
}

export interface CompanyInfo {
	logo?: string;
	phone: string;
	location: string;
}

export interface FooterProps {
	sections: FooterSection[];
	socialLinks: SocialLink[];
	companyInfo: CompanyInfo;
	bottomLinks: FooterLink[];
	copyrightText: string;
}

export interface FaqItem {
	id?: number;
	label: string;
	answer: string;
}

export interface YoutubeItem {
	id: number;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	category: string;
}

export interface Order {
	id: number;
	customerName: string;
	date: string;
	items: number;
	total: number;
	status: 'pending' | 'successful' | 'cancelled';
}

export const FooterConfig = {
	sections: [
		{
			title: 'Information',
			links: [
				{ label: 'About Us', href: '/about' },
				{ label: 'Blog', href: '/blog' },
				{ label: 'Contact', href: '/about#get-in-touch' },
				{ label: 'Help', href: '/about#faq' },
			],
		},
		{
			title: 'Our Services',
			links: [
				{ label: 'Live Chat Consultation', href: '#' },
				{ label: 'Speak To Dermatologist', href: '/quick-consultation' },
			],
		},
		// {
		// 	title: 'Account',
		// 	links: [
		// 		{ label: 'Account', href: '/account' },
		// 		{ label: 'Chart', href: '/chart' },
		// 		{ label: 'Recent Viewed', href: '/recent-viewed' },
		// 		{ label: 'Track Order', href: '/track-order' },
		// 		{ label: 'Payment Settings', href: '/payment-settings' },
		// 	],
		// },
	],
	socialLinks: [
		{ platform: 'facebook', href: 'https://facebook.com/yourpage' },
		{ platform: 'instagram', href: 'https://instagram.com/yourpage' },
		{ platform: 'twitter', href: 'https://twitter.com/yourpage' },
		{ platform: 'youtube', href: 'https://youtube.com/yourchannel' },
	],
	companyInfo: {
		phone: '+234 904 764 4596',
		location:
			'SHOP A5 OJOMU MARKET PLAZA,NEW ROAD BUS STOP, LEKKI LAGOS NIGERIA.',
		logo: '/Logo/footer-logo.svg',
	},
	bottomLinks: [
		{ label: 'Terms & Conditions', href: '/terms' },
		{ label: 'Privacy Policy', href: '/privacy' },
	],
	copyrightText: '© Copyright 2025, All Rights Reserved',
};

export const collections: Collection[] = [
	{
		id: 1,
		name: 'Skincare',
		image: '/Homepage/collections/skincare.svg',
		bgColor: 'bg-primaryPink',
	},
	{
		id: 2,
		name: 'Body Care',
		image: '/Homepage/collections/bodycare.svg',
		bgColor: 'bg-secondaryPink',
	},
	{
		id: 3,
		name: 'Hair Care',
		image: '/Homepage/collections/haircare.svg',
		bgColor: 'bg-primaryPink',
	},
	{
		id: 4,
		name: 'Make Up',
		image: '/Homepage/collections/makeup.svg',
		bgColor: 'bg-secondaryPink',
	},
];

// export const products: Product[] = [
// 	{
// 		id: 1,
// 		title: 'CeraVe Hydrating Cleanser 12oz / 355ml',
// 		image:
// 			'/Products/dummyProducts/hydrating-foaming-oil-cleanser-cleanser_front.webp',
// 		rating: 4.7,
// 		reviews: 1023,
// 		originalPrice: 18000,
// 		salePrice: 15000,
// 		discount: 17,
// 		description:
// 			'Gentle cleanser that removes dirt and oil without disrupting skin’s natural barrier.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 2,
// 		title: 'Neutrogena Foaming Facial Wash 6.7oz / 200ml',
// 		image: '/Products/dummyProducts/neurogena-forming-facial.webp',
// 		rating: 4.6,
// 		reviews: 879,
// 		originalPrice: 14000,
// 		salePrice: 12000,
// 		discount: 14,
// 		description: 'Oil-free foaming wash for clearer, fresher-looking skin.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 3,
// 		title: 'Aveeno Daily Moisturizing Lotion 12oz / 354ml',
// 		image: '/Products/dummyProducts/Aveeno-Daily-Moisturizing-Lotion.webp',
// 		rating: 4.8,
// 		reviews: 1340,
// 		originalPrice: 20000,
// 		salePrice: 17000,
// 		discount: 15,
// 		description:
// 			'Clinically proven lotion with colloidal oatmeal for smooth, hydrated skin.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 4,
// 		title: 'The Ordinary Vitamin C Suspension 30% 1oz / 30ml',
// 		image: '/Products/dummyProducts/ord-glyc-acid-7pct-100ml-Aug-UPC.webp',
// 		rating: 4.5,
// 		reviews: 760,
// 		originalPrice: 25000,
// 		salePrice: 19000,
// 		discount: 24,
// 		description:
// 			'Brightens skin tone and reduces signs of aging with stabilized Vitamin C.',
// 		category: 'Serum',
// 	},
// 	{
// 		id: 5,
// 		title: 'The Ordinary Niacinamide 10% + Zinc 1% 1oz / 30ml',
// 		image:
// 			'/Products/dummyProducts/FY25-D41247-ORD-Web-Argl-10pct-1x1-EN-1.webp',
// 		rating: 4.6,
// 		reviews: 980,
// 		originalPrice: 18000,
// 		salePrice: 14000,
// 		discount: 22,
// 		description: 'Reduces appearance of blemishes and controls sebum activity.',
// 		category: 'Serum',
// 	},
// 	{
// 		id: 6,
// 		title: 'First Aid Beauty Ultra Repair Cream 6oz / 170g',
// 		image: '/Products/dummyProducts/UltraRepairCream_6oz_Lead.webp',
// 		rating: 4.9,
// 		reviews: 1100,
// 		originalPrice: 34000,
// 		salePrice: 29000,
// 		discount: 15,
// 		description:
// 			'Intense hydration for dry, distressed skin and eczema-prone areas.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 7,
// 		title: 'Laneige Water Bank Blue Hyaluronic Cream 1.6oz / 50ml',
// 		image: '/Products/dummyProducts/LN_WBCM_24AD_Product_02_540x.webp',
// 		rating: 4.7,
// 		reviews: 890,
// 		originalPrice: 38000,
// 		salePrice: 32000,
// 		discount: 16,
// 		description:
// 			'Deeply hydrates and strengthens the skin barrier with micro hyaluronic acid.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 8,
// 		title: 'Innisfree Green Tea Seed Serum 2.7oz / 80ml',
// 		image: '/images/skincare3.jpg',
// 		rating: 4.8,
// 		reviews: 950,
// 		originalPrice: 27000,
// 		salePrice: 23000,
// 		discount: 15,
// 		description: 'Lightweight serum enriched with green tea antioxidants.',
// 		category: 'Serum',
// 	},
// 	{
// 		id: 9,
// 		title: 'La Roche-Posay Effaclar Duo Acne Treatment 1.35oz / 40ml',
// 		image: '/images/skincare4.jpg',
// 		rating: 4.6,
// 		reviews: 720,
// 		originalPrice: 32000,
// 		salePrice: 28000,
// 		discount: 12,
// 		description:
// 			'Dual-action treatment to reduce acne and clear clogged pores.',
// 		category: 'Treatment',
// 	},
// 	{
// 		id: 10,
// 		title: 'Neutrogena Hydro Boost Water Gel 1.7oz / 50ml',
// 		image: '/Products/dummyProducts/Neutrogena-Hydro-Boost-Water-Gel.jpeg',
// 		rating: 4.7,
// 		reviews: 1350,
// 		originalPrice: 25000,
// 		salePrice: 21000,
// 		discount: 16,
// 		description:
// 			'Refreshing water gel with hyaluronic acid for intense hydration.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 11,
// 		title: 'Fresh Rose Deep Hydration Face Cream 1.6oz / 50ml',
// 		image: '/images/skincare1.jpg',
// 		rating: 4.8,
// 		reviews: 640,
// 		originalPrice: 42000,
// 		salePrice: 36000,
// 		discount: 14,
// 		description: 'Delivers 24-hour hydration with time-release technology.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 12,
// 		title: 'The Ordinary Glycolic Acid 7% Toning Solution 8oz / 240ml',
// 		image: '/Products/dummyProducts/rdn-matrixyl-10pct-ha-30ml.webp',
// 		rating: 4.5,
// 		reviews: 1000,
// 		originalPrice: 20000,
// 		salePrice: 16000,
// 		discount: 20,
// 		description: 'Exfoliating toner for improved skin radiance and clarity.',
// 		category: 'Toner',
// 	},
// 	{
// 		id: 13,
// 		title: 'Clinique Clarifying Lotion 2 6.7oz / 200ml',
// 		image: '/images/skincare3.jpg',
// 		rating: 4.6,
// 		reviews: 890,
// 		originalPrice: 27000,
// 		salePrice: 23000,
// 		discount: 15,
// 		description: 'Gentle exfoliating toner for smoother, clearer skin.',
// 		category: 'Toner',
// 	},
// 	{
// 		id: 14,
// 		title: 'Kiehl’s Calendula Herbal Extract Toner 8.4oz / 250ml',
// 		image: '/images/skincare4.jpg',
// 		rating: 4.7,
// 		reviews: 810,
// 		originalPrice: 38000,
// 		salePrice: 32000,
// 		discount: 16,
// 		description: 'Alcohol-free toner with soothing calendula petals.',
// 		category: 'Toner',
// 	},
// 	{
// 		id: 15,
// 		title: 'The Ordinary Squalane Cleanser 5oz / 150ml',
// 		image: '/images/skincare5.jpg',
// 		rating: 4.6,
// 		reviews: 730,
// 		originalPrice: 22000,
// 		salePrice: 18000,
// 		discount: 18,
// 		description: 'Gentle cleansing balm that dissolves makeup and impurities.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 16,
// 		title: 'Cetaphil Gentle Foaming Cleanser 8oz / 236ml',
// 		image: '/images/skincare1.jpg',
// 		rating: 4.7,
// 		reviews: 940,
// 		originalPrice: 19000,
// 		salePrice: 15000,
// 		discount: 21,
// 		description: 'Mild foaming cleanser suitable for sensitive skin.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 17,
// 		title: 'Murad Oil-Free Moisturizer SPF 30 1.7oz / 50ml',
// 		image: '/images/skincare2.jpg',
// 		rating: 4.5,
// 		reviews: 650,
// 		originalPrice: 36000,
// 		salePrice: 31000,
// 		discount: 14,
// 		description: 'Hydrating yet lightweight moisturizer with SPF protection.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 18,
// 		title: 'EltaMD UV Clear Broad-Spectrum SPF 46 1.7oz / 50ml',
// 		image: '/images/skincare3.jpg',
// 		rating: 4.9,
// 		reviews: 1420,
// 		originalPrice: 40000,
// 		salePrice: 35000,
// 		discount: 12,
// 		description:
// 			'Dermatologist-recommended sunscreen for sensitive and acne-prone skin.',
// 		category: 'Sunscreen',
// 	},
// 	{
// 		id: 19,
// 		title: 'Supergoop! Unseen Sunscreen SPF 40 1.7oz / 50ml',
// 		image: '/images/skincare4.jpg',
// 		rating: 4.7,
// 		reviews: 980,
// 		originalPrice: 36000,
// 		salePrice: 32000,
// 		discount: 11,
// 		description: 'Weightless, invisible sunscreen that doubles as a primer.',
// 		category: 'Sunscreen',
// 	},
// 	{
// 		id: 20,
// 		title: 'Paula’s Choice Skin Perfecting 2% BHA Liquid Exfoliant 4oz / 118ml',
// 		image: '/images/skincare5.jpg',
// 		rating: 4.8,
// 		reviews: 2100,
// 		originalPrice: 34000,
// 		salePrice: 29000,
// 		discount: 15,
// 		description:
// 			'Best-selling liquid exfoliant for unclogging pores and smoothing skin.',
// 		category: 'Exfoliant',
// 	},
// 	{
// 		id: 21,
// 		title: 'Bioderma Sensibio H2O Micellar Water 16.7oz / 500ml',
// 		image: '/images/skincare1.jpg',
// 		rating: 4.8,
// 		reviews: 1800,
// 		originalPrice: 19000,
// 		salePrice: 16000,
// 		discount: 16,
// 		description:
// 			'Cult-favorite micellar water that removes makeup and soothes skin.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 22,
// 		title: 'CeraVe Micellar Cleansing Water 10floz / 295ml',
// 		image: '/images/skincare2.jpg',
// 		rating: 4.7,
// 		reviews: 1200,
// 		originalPrice: 15000,
// 		salePrice: 12000,
// 		discount: 20,
// 		description: 'Fragrance-free micellar water for all skin types.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 23,
// 		title: 'Pixi Glow Tonic Exfoliating Toner 8.5oz / 250ml',
// 		image: '/images/skincare3.jpg',
// 		rating: 4.6,
// 		reviews: 1000,
// 		originalPrice: 29000,
// 		salePrice: 24000,
// 		discount: 17,
// 		description: 'Alcohol-free exfoliating toner with 5% glycolic acid.',
// 		category: 'Toner',
// 	},
// 	{
// 		id: 24,
// 		title: 'Drunk Elephant Protini Polypeptide Cream 1.7oz / 50ml',
// 		image: '/images/skincare4.jpg',
// 		rating: 4.7,
// 		reviews: 890,
// 		originalPrice: 68000,
// 		salePrice: 60000,
// 		discount: 12,
// 		description: 'Strengthens and restores younger, firmer-looking skin.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 25,
// 		title: 'Sunday Riley Good Genes Lactic Acid Serum 1oz / 30ml',
// 		image: '/images/skincare5.jpg',
// 		rating: 4.6,
// 		reviews: 970,
// 		originalPrice: 85000,
// 		salePrice: 75000,
// 		discount: 12,
// 		description: 'Exfoliating serum that instantly brightens and smooths skin.',
// 		category: 'Serum',
// 	},
// 	{
// 		id: 26,
// 		title: 'Olay Regenerist Micro-Sculpting Cream 1.7oz / 50ml',
// 		image: '/images/skincare1.jpg',
// 		rating: 4.7,
// 		reviews: 1400,
// 		originalPrice: 35000,
// 		salePrice: 30000,
// 		discount: 14,
// 		description: 'Anti-aging cream with hyaluronic acid and amino-peptides.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 27,
// 		title: 'Tatcha The Water Cream 1.7oz / 50ml',
// 		image: '/images/skincare2.jpg',
// 		rating: 4.8,
// 		reviews: 880,
// 		originalPrice: 68000,
// 		salePrice: 60000,
// 		discount: 12,
// 		description: 'Oil-free water cream for poreless, balanced skin.',
// 		category: 'Moisturizer',
// 	},
// 	{
// 		id: 28,
// 		title: 'Glossier Milky Jelly Cleanser 6oz / 177ml',
// 		image: '/images/skincare3.jpg',
// 		rating: 4.5,
// 		reviews: 760,
// 		originalPrice: 18000,
// 		salePrice: 15000,
// 		discount: 17,
// 		description: 'pH-balanced cleanser that’s gentle yet effective.',
// 		category: 'Cleanser',
// 	},
// 	{
// 		id: 29,
// 		title: 'COSRX Advanced Snail 96 Mucin Power Essence 3.3oz / 100ml',
// 		image: '/images/skincare4.jpg',
// 		rating: 4.8,
// 		reviews: 1200,
// 		originalPrice: 25000,
// 		salePrice: 22000,
// 		discount: 12,
// 		description:
// 			'Nourishing essence that repairs skin damage and improves elasticity.',
// 		category: 'Essence',
// 	},
// 	{
// 		id: 30,
// 		title: 'SK-II Facial Treatment Essence 5.4oz / 160ml',
// 		image: '/images/skincare5.jpg',
// 		rating: 4.9,
// 		reviews: 1100,
// 		originalPrice: 99000,
// 		salePrice: 89000,
// 		discount: 10,
// 		description:
// 			'Iconic essence rich in Pitera™ to improve skin texture and radiance.',
// 		category: 'Essence',
// 	},
// ];

export const faq: FaqItem[] = [
	{
		id: 1,
		label: 'Are your products suitable for all skin types?',
		answer:
			'Yes! Our products are carefully formulated with gentle ingredients that work for dry, oily, combination, and sensitive skin types.',
	},
	{
		id: 2,
		label: 'How long does it take to see results from using your products?',
		answer:
			'Most users start noticing visible improvements within 2–4 weeks of consistent use. For best results, follow the recommended routine daily.',
	},
	{
		id: 3,
		label: 'What makes your skincare product different?',
		answer:
			'We combine dermatologist-approved formulas with natural ingredients, ensuring safe, effective, and long-lasting results without harsh chemicals.',
	},
	{
		id: 4,
		label: 'What is your return and refund policy?',
		answer:
			'We offer a 30-day return policy. If you are not satisfied with your purchase, you can request a refund or exchange within 30 days of delivery.',
	},
];

export const youtubeVideos: YoutubeItem[] = [
	{
		id: 1,
		title: 'Good Molecules for Brightening',
		description: 'Learn about brightening skincare products',
		thumbnail: '/About/about-1.svg',
		url: 'https://www.youtube.com/watch?v=7v5vkOfGVWM',
		category: 'Skincare',
	},
	{
		id: 2,
		title: 'Skincare Routine Tips',
		description: 'Daily routine for healthy skin',
		thumbnail: '/About/about-2.svg',
		url: 'https://www.youtube.com/shorts/VvG0_AFJnOk',
		category: 'Tutorial',
	},
	{
		id: 3,
		title: 'Product Review Series',
		description: 'Honest reviews of popular products',
		thumbnail: '/About/about-3.svg',
		url: 'https://youtu.be/example2',
		category: 'Review',
	},
	{
		id: 4,
		title: 'Natural Ingredients Guide',
		description: 'Benefits of natural skincare ingredients',
		thumbnail: '/About/about-4.svg',
		url: 'https://youtu.be/example3',
		category: 'Education',
	},
	{
		id: 5,
		title: 'Seasonal Skincare',
		description: 'Adapting your routine to weather changes',
		thumbnail: '/About/about-3.svg',
		url: 'https://youtu.be/example4',
		category: 'Tips',
	},
	{
		id: 6,
		title: 'Acne Solutions',
		description: 'Effective treatments for acne-prone skin',
		thumbnail: '/About/about-1.svg',
		url: 'https://youtu.be/example5',
		category: 'Solutions',
	},
];

export const orders: Order[] = [
	{
		id: 1,
		customerName: 'Sarah Johnson',
		date: '2024-01-15',
		items: 3,
		total: 45000,
		status: 'pending',
	},
	{
		id: 2,
		customerName: 'Michael Brown',
		date: '2024-01-14',
		items: 2,
		total: 28000,
		status: 'successful',
	},
	{
		id: 3,
		customerName: 'Emily Davis',
		date: '2024-01-14',
		items: 5,
		total: 75000,
		status: 'cancelled',
	},
	{
		id: 4,
		customerName: 'David Wilson',
		date: '2024-01-13',
		items: 1,
		total: 15000,
		status: 'successful',
	},
	{
		id: 5,
		customerName: 'Jennifer Miller',
		date: '2024-01-13',
		items: 4,
		total: 52000,
		status: 'pending',
	},
	{
		id: 6,
		customerName: 'Robert Taylor',
		date: '2024-01-12',
		items: 2,
		total: 32000,
		status: 'successful',
	},
	{
		id: 7,
		customerName: 'Lisa Anderson',
		date: '2024-01-12',
		items: 3,
		total: 41000,
		status: 'cancelled',
	},
	{
		id: 8,
		customerName: 'James Martinez',
		date: '2024-01-11',
		items: 1,
		total: 18000,
		status: 'pending',
	},
	{
		id: 9,
		customerName: 'Maria Garcia',
		date: '2024-01-11',
		items: 6,
		total: 89000,
		status: 'successful',
	},
	{
		id: 10,
		customerName: 'William Lee',
		date: '2024-01-10',
		items: 2,
		total: 27000,
		status: 'cancelled',
	},
];

export const collageImages = [
	{
		src: '/quick-consultation/portrait-woman-doing-her-beauty-regimen-skincare-routine.jpg',
		alt: 'Happy patient',
		position: 'bottom-right',
	},
];

export const benefits = [
	{
		title: 'Tailored Analysis & Plans',
		description:
			'Personalized assessments and routines for your unique skin concerns.',
	},
	{
		title: 'Exclusive Access',
		description: 'Obtain prescription-only skincare products or medications',
	},
	{
		title: 'Peak Convenience',
		description: 'Save both time and money with online consultations',
	},
];

// Carousel data with different content for each slide
export const carouselData = [
	{
		id: 1,
		backgroundImage: '/Homepage/ordinary-carousel.webp',
		videoSrc: null,
		subtitle: 'The Ordinary',
		highlightText: 'Clinical Formulations',
		subtitleEnd: 'Exceptional Results',
		title: 'SCIENCE-BACKED SKINCARE',
		buttonText: 'Shop The Ordinary',
		buttonAction: '/brands',
	},
	{
		id: 2,
		backgroundImage: '/Homepage/medix-carousel.webp',
		videoSrc: null,
		subtitle: 'Medix 5.5',
		highlightText: 'Professional Grade',
		subtitleEnd: 'Anti-Aging Solutions',
		title: 'TURN BACK TIME',
		buttonText: 'Discover Medix',
		buttonAction: '/brands',
	},
	{
		id: 3,
		backgroundImage: '/Homepage/medix-carousel-two.webp',
		videoSrc: null,
		subtitle: 'Advanced',
		highlightText: 'Vitamin C + Retinol',
		subtitleEnd: 'Power Duo',
		title: 'RADIANT SKIN AWAITS',
		buttonText: 'Get Glowing',
		buttonAction: '/brands',
	},

	// {
	// 	id: 4,
	// 	backgroundImage: '/Homepage/speakToDermatologist.png',
	// 	videoSrc: '/videos/carousel.mp4',
	// 	subtitle: null,
	// 	highlightText: null,
	// 	subtitleEnd: null,
	// 	title: 'Talk To An Experienced Specialist Anytime, Anywhere',
	// 	buttonText: 'Book Consultation',
	// 	buttonAction: '/quick-consultation',
	// 	isVideoSlide: true,
	// },
];
