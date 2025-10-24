import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { FooterConfig } from '@/utils/utils';

interface FooterLink {
	label: string;
	href: string;
}

interface FooterSection {
	title: string;
	links: FooterLink[];
}

interface SocialLink {
	platform: 'facebook' | 'instagram' | 'twitter' | 'youtube';
	href: string;
}

interface FooterProps {
	sections?: FooterSection[];
	socialLinks?: SocialLink[];
	companyInfo?: {
		name: string;
		logo?: string;
		phone: string;
		location: string;
	};
	bottomLinks?: FooterLink[];
	copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
	sections = FooterConfig.sections,
	socialLinks = FooterConfig.socialLinks,
	companyInfo = FooterConfig.companyInfo,
	bottomLinks = FooterConfig.bottomLinks,
	copyrightText = FooterConfig.copyrightText,
}) => {
	const getSocialIcon = (platform: string) => {
		const iconProps = {
			size: 20,
			className: 'text-white hover:text-purple-200 transition-colors',
		};

		switch (platform) {
			case 'facebook':
				return <FiFacebook {...iconProps} />;
			case 'instagram':
				return <FiInstagram {...iconProps} />;
			case 'twitter':
				return <FiTwitter {...iconProps} />;
			case 'youtube':
				return <FiYoutube {...iconProps} />;
			default:
				return null;
		}
	};

	return (
		<footer className='bg-primaryPurple text-white'>
			<div className='container mx-auto px-4 py-8 max-w-7xl'>
				{/* Main Footer Content */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{/* Company Info Section */}
					<div className='space-y-4'>
						{/* Logo */}
						<div className='flex items-center space-x-2'>
							{companyInfo.logo ? (
								<Image
									src={companyInfo.logo}
									alt='rezino logo'
									className='h-[77px] w-[71px]'
									width={71}
									height={77}
								/>
							) : (
								<div className='h-8 w-8 bg-white rounded-full flex items-center justify-center'>
									<span className='text-purple-600 font-bold text-sm'>R</span>
								</div>
							)}
						</div>

						{/* Contact Info */}
						<div className='space-y-2 text-sm'>
							<div className='flex items-center space-x-2'>
								<span>{companyInfo.phone}</span>
							</div>
							<div className='flex items-center space-x-2'>
								<span>{companyInfo.phone}</span>
							</div>
							<div className='flex items-center space-x-2'>
								<span>{companyInfo.location}</span>
							</div>
						</div>

						{/* Social Links */}
						<div className='flex space-x-3 pt-2'>
							{socialLinks.map((social, index) => (
								<Link
									key={index}
									href={social.href}
									className='p-1.5'
									aria-label={`Follow us on ${social.platform}`}>
									{getSocialIcon(social.platform)}
								</Link>
							))}
						</div>
					</div>

					{/* Footer Sections */}
					{sections.map((section, sectionIndex) => (
						<div
							key={sectionIndex}
							className='space-y-4'>
							<h3 className='text-lg font-semibold'>{section.title}</h3>
							<ul className='space-y-2'>
								{section.links.map((link, linkIndex) => (
									<li key={linkIndex}>
										<Link
											href={link.href}
											className='text-sm text-white/80 hover:text-white transition-colors hover:underline'>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Footer Bottom */}
				<div className='mt-8 pt-6 border-t border-white/20'>
					<div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
						{/* Copyright */}
						<div className='text-sm text-white/80'>{copyrightText}</div>

						{/* Bottom Links */}
						<div className='flex flex-wrap justify-center md:justify-end space-x-6 text-sm'>
							{bottomLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									className='text-white/80 hover:text-white transition-colors hover:underline'>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
