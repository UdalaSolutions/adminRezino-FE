import AdminTopNav from '../components/navbar/adminTopBar';
import AdminBottomNavbar from '../components/navbar/adminBottomBar';
import Footer from '@/app/components/footer';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header>
				<AdminTopNav />
				<AdminBottomNavbar />
			</header>
			<main>{children}</main>
			<Footer />
		</>
	);
}
