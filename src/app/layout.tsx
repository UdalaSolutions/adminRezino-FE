import type { Metadata } from 'next';
import { Gilda_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MobileNavProvider } from './components/navbar/MobileNavContext';
import SessionSyncWrapper from './components/SessionSyncWrapper';

const gildaDisplay = Gilda_Display({
	variable: '--font-gilda-display',
	subsets: ['latin'],
	weight: '400',
});

export const metadata: Metadata = {
	title: 'Rezino Skincare',
	description:
		'Rezino Skincare — Discover natural, effective, and cruelty-free skincare products designed to nourish and rejuvenate your skin. Experience radiant, healthy skin with our carefully crafted formulas tailored for all skin types.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${gildaDisplay.variable} `}>
				<Providers>
					<SessionSyncWrapper />
					<ToastContainer
						position='top-right'
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme='light'
					/>
					<MobileNavProvider>{children}</MobileNavProvider>
				</Providers>
			</body>
		</html>
	);
}
