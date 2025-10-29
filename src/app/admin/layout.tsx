import AdminShell from '../components/navbar/adminShell';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<AdminShell>{children}</AdminShell>
		</>
	);
}
