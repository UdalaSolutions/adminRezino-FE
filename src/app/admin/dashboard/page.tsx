'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import {
	getAllNumberOfCustomers,
	getAllProductsSold,
	getAllProducts,
	getAllOrders,
	getAllPayments,
	Transaction,
} from '@/services/admin';

type Product = {
	id: string | number;
	productName?: string;
	productCategory?: string;
	cartoonQuantity?: number;
	productPrice?: number | string;
};

type Order = {
	id?: string | number;
	orderId?: string | number;
	productId?: string | number;
	quantity?: number;
	price?: number;
	discountPrice?: number;
	dateTimeCreated?: number[];
};

const AdminDashboard = () => {
	const [customerCount, setCustomerCount] = useState<number | null>(null);
	const [loadingCustomerCount, setLoadingCustomerCount] = useState(false);
	const [customerError, setCustomerError] = useState<string | null>(null);

	const [productsSold, setProductsSold] = useState<number | null>(null);
	const [loadingProductsSold, setLoadingProductsSold] = useState(false);
	const [productsSoldError, setProductsSoldError] = useState<string | null>(
		null
	);

	const [products, setProducts] = useState<Product[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [productsError, setProductsError] = useState<string | null>(null);

	const [orders, setOrders] = useState<Order[]>([]);
	const [loadingOrders, setLoadingOrders] = useState(false);
	const [ordersError, setOrdersError] = useState<string | null>(null);

	// NEW: payments state (fetched from get-payment-history)
	const [payments, setPayments] = useState<Transaction[]>([]);
	const [loadingPayments, setLoadingPayments] = useState(false);
	const [paymentsError, setPaymentsError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			setLoadingCustomerCount(true);
			setLoadingProductsSold(true);
			setLoadingProducts(true);
			setLoadingOrders(true);
			setLoadingPayments(true);

			setCustomerError(null);
			setProductsSoldError(null);
			setProductsError(null);
			setOrdersError(null);
			setPaymentsError(null);

			try {
				const [customers, sold, productList, ordersData, paymentList] =
					await Promise.all([
						getAllNumberOfCustomers(),
						getAllProductsSold(),
						getAllProducts(),
						getAllOrders(),
						getAllPayments(),
					]);

				setCustomerCount(typeof customers === 'number' ? customers : null);
				setProductsSold(typeof sold === 'number' ? sold : null);
				setProducts(Array.isArray(productList) ? productList : []);
				setOrders(Array.isArray(ordersData) ? ordersData : []);
				setPayments(Array.isArray(paymentList) ? paymentList : []);
			} catch (error) {
				console.error('Dashboard fetch error', error);
				setCustomerError('Failed to fetch customers');
				setProductsSoldError('Failed to fetch products sold');
				setProductsError('Failed to fetch products');
				setOrdersError('Failed to fetch orders');
				setPaymentsError('Failed to fetch payments');
			} finally {
				setLoadingCustomerCount(false);
				setLoadingProductsSold(false);
				setLoadingProducts(false);
				setLoadingOrders(false);
				setLoadingPayments(false);
			}
		};

		fetchDashboardData();
	}, []);

	// derive number of pending payments
	const pendingPaymentCount = useMemo(() => {
		if (!payments || payments.length === 0) return 0;
		return payments.filter((p) => String(p.status).toLowerCase() === 'pending')
			.length;
	}, [payments]);

	const statsData = useMemo(
		() => [
			{
				title: 'Orders (Pending)',
				value: loadingPayments
					? 'Loading...'
					: paymentsError
					? 'Error'
					: pendingPaymentCount.toString(),
				icon: 'carbon:sales-ops',
				iconColor: 'text-indigo-600',
			},
			{
				title: 'Sales',
				value: loadingProductsSold
					? 'Loading...'
					: productsSoldError
					? 'Error'
					: productsSold?.toString() ?? '0',
				icon: 'carbon:money',
				iconColor: 'text-emerald-600',
			},
			{
				title: 'Customers',
				value: loadingCustomerCount
					? 'Loading...'
					: customerError
					? 'Error'
					: customerCount?.toString() ?? '0',
				icon: 'ph:users-three-light',
				iconColor: 'text-violet-600',
			},
			{
				title: 'Products',
				value: loadingProducts
					? 'Loading...'
					: productsError
					? 'Error'
					: products.length.toString(),
				icon: 'mdi:package-variant-closed',
				iconColor: 'text-sky-600',
			},
		],
		[
			loadingPayments,
			paymentsError,
			pendingPaymentCount,
			loadingProductsSold,
			productsSoldError,
			productsSold,
			loadingCustomerCount,
			customerError,
			customerCount,
			loadingProducts,
			productsError,
			products.length,
		]
	);

	const recentPayments = payments.slice(0, 6); // show top recent payments

	const recentProducts = products.slice(0, 5);

	const getStatusColor = (status?: string) => {
		switch (status?.toLowerCase()) {
			case 'successful':
			case 'delivered':
				return 'text-green-600 bg-green-50';
			case 'pending':
			case 'processing':
				return 'text-orange-600 bg-orange-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const formatShortEmail = (email?: string, maxLocal = 10) => {
		if (!email || typeof email !== 'string') return '—';
		if (!email.includes('@')) {
			return email.length > maxLocal ? `${email.slice(0, maxLocal)}...` : email;
		}

		const [local] = email.split('@');
		const shortLocal =
			local.length > maxLocal ? local.slice(0, maxLocal) : local;
		return `${shortLocal}@...`;
	};

	const formatDate = (dateArray?: number[]) => {
		if (!Array.isArray(dateArray)) return 'N/A';
		const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
		const date = new Date(year, month - 1, day, hour, minute, second);
		return date.toLocaleString();
	};

	return (
		<section className='my-6 mx-2 md:mx-4 lg:mx-6'>
			<div className='space-y-8'>
				{/* Stats Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{statsData.map((stat) => (
						<div
							key={stat.title}
							className='bg-white rounded-xl p-5 text-[#111111] border border-[#E4E9F1] shadow-sm flex items-center gap-4'>
							<div className='flex-shrink-0'>
								<div className='w-12 h-12 rounded-lg flex items-center justify-center border border-[#E4E9F1] bg-white'>
									<Icon
										icon={stat.icon}
										width='28'
										height='28'
										className={`${stat.iconColor}`}
										aria-hidden
									/>
								</div>
							</div>

							<div className='flex-1 min-w-0'>
								<p className='text-xl sm:text-2xl font-semibold leading-tight'>
									{stat.value}
								</p>
								<p className='text-sm text-[#555555] font-medium mt-1'>
									{stat.title}
								</p>

								{/* Errors */}
								{stat.title.includes('Customers') && customerError && (
									<p className='text-red-500 text-xs mt-2'>{customerError}</p>
								)}
								{stat.title.includes('Sales') && productsSoldError && (
									<p className='text-red-500 text-xs mt-2'>
										{productsSoldError}
									</p>
								)}
								{stat.title.includes('Products') && productsError && (
									<p className='text-red-500 text-xs mt-2'>{productsError}</p>
								)}
								{stat.title.includes('Orders') && paymentsError && (
									<p className='text-red-500 text-xs mt-2'>{paymentsError}</p>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Main Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Recent Payments */}
					<div className='bg-white rounded-xl shadow-sm'>
						<div className='flex items-center justify-between p-4 pb-0'>
							<h2 className='text-lg md:text-xl font-semibold'>
								Recent Payments
							</h2>
							<Link
								href='/admin/payment'
								className='text-primaryPurple text-sm md:text-base underline font-medium'>
								See All
							</Link>
						</div>

						{/* Table on md+ */}
						<div className='hidden md:block overflow-x-auto p-4 py-2'>
							<table className='w-full'>
								<thead>
									<tr className='text-left text-sm md:text-base bg-[#E5CFDD66]'>
										<th className='p-3 font-medium'>Customer Email</th>
										<th className='p-3 font-medium'>Amount</th>
										<th className='p-3 font-medium'>Status</th>
										<th className='p-3 font-medium'>Paid At</th>
									</tr>
								</thead>
								<tbody className='text-sm md:text-base'>
									{loadingPayments ? (
										<tr>
											<td
												colSpan={5}
												className='text-center py-3'>
												Loading payments...
											</td>
										</tr>
									) : paymentsError ? (
										<tr>
											<td
												colSpan={5}
												className='text-center text-red-500 py-3'>
												{paymentsError}
											</td>
										</tr>
									) : recentPayments.length > 0 ? (
										recentPayments.map((p) => (
											<tr
												key={p.id}
												className='border-b border-gray-50 text-center text-sm'>
												<td className='py-3 text-gray-600 truncate line-cl'>
													{formatShortEmail(p.userEmail)}
												</td>
												<td className='py-3'>
													₦{Number(p.amount ?? 0).toLocaleString()}
												</td>
												<td className='py-3'>
													<span
														className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
															p.status
														)}`}>
														{p.status}
													</span>
												</td>
												<td className='py-3'>{formatDate(p.paidAt)}</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan={5}
												className='text-center py-3 text-gray-500'>
												No payments found.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* Mobile list */}
						<div className='md:hidden p-4 space-y-3'>
							{loadingPayments ? (
								<div className='text-center py-2'>Loading payments...</div>
							) : paymentsError ? (
								<div className='text-center text-red-500 py-2'>
									{paymentsError}
								</div>
							) : recentPayments.length > 0 ? (
								recentPayments.map((p) => (
									<div
										key={p.id}
										className='bg-gray-50 rounded-lg p-3'>
										<div className='flex items-center justify-between'>
											<div>
												<div className='font-medium'>
													Ref: {p.paystackReference}
												</div>
												<div className='text-xs text-gray-500'>
													{p.userEmail}
												</div>
												<div className='text-xs text-gray-500'>
													{formatDate(p.paidAt)}
												</div>
											</div>
											<div className='text-right'>
												<div className='font-medium'>
													₦{Number(p.amount ?? 0).toLocaleString()}
												</div>
												<div
													className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
														p.status
													)}`}>
													{p.status}
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className='text-center text-gray-500 py-2'>
									No payments found.
								</div>
							)}
						</div>
					</div>

					{/* Recent Products (unchanged) */}
					<div className='bg-white rounded-xl shadow-sm'>
						<div className='flex items-center justify-between p-4 pb-0'>
							<h2 className='text-lg md:text-xl font-semibold'>
								Recent Products
							</h2>
							<Link
								href='/admin/product'
								className='text-primaryPurple text-sm md:text-base underline font-medium'>
								See All
							</Link>
						</div>

						{/* Table for md+ */}
						<div className='hidden md:block overflow-x-auto p-4 py-2'>
							<table className='w-full'>
								<thead>
									<tr className='text-left text-sm md:text-base bg-[#E5CFDD66]'>
										<th className='p-3 font-medium'>Product Name</th>
										<th className='p-3 font-medium'>Category</th>
										<th className='p-3 font-medium'>Stock</th>
										<th className='p-3 font-medium'>Price</th>
									</tr>
								</thead>
								<tbody className='text-sm md:text-base'>
									{recentProducts.map((product) => (
										<tr
											key={product.id}
											className='border-b border-gray-50'>
											<td className='py-3 px-1.5 text-sm'>
												{product.productName}
											</td>
											<td className='py-3 px-1.5 text-gray-600'>
												{product.productCategory}
											</td>
											<td className='py-3 text-gray-600 px-1.5'>
												{product.cartoonQuantity}
											</td>
											<td className='py-3 px-1.5'>
												₦{Number(product.productPrice ?? 0).toLocaleString()}
											</td>
										</tr>
									))}
									{loadingProducts && (
										<tr>
											<td
												colSpan={4}
												className='py-3 text-center'>
												Loading products...
											</td>
										</tr>
									)}
									{productsError && (
										<tr>
											<td
												colSpan={4}
												className='py-3 text-center text-red-400'>
												{productsError}
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* Mobile cards */}
						<div className='md:hidden p-4 space-y-3'>
							{recentProducts.map((product) => (
								<div
									key={product.id}
									className='bg-gray-50 rounded-lg p-3 flex items-center justify-between'>
									<div>
										<div className='font-medium text-sm'>
											{product.productName}
										</div>
										<div className='text-xs text-gray-500'>
											{product.productCategory}
										</div>
									</div>
									<div className='text-right'>
										<div className='text-sm'>
											Stock: {product.cartoonQuantity}
										</div>
										<div className='text-sm'>
											₦{Number(product.productPrice ?? 0).toLocaleString()}
										</div>
									</div>
								</div>
							))}

							{loadingProducts && (
								<div className='text-center py-2 text-sm'>
									Loading products...
								</div>
							)}
							{productsError && (
								<div className='text-center py-2 text-sm text-red-500'>
									{productsError}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Recent Orders (unchanged from previous design) */}
				<div className='bg-white rounded-xl shadow-sm'>
					<div className='flex items-center justify-between p-4 pb-0'>
						<h2 className='text-lg md:text-xl font-semibold'>Recent Orders</h2>
						<Link
							href='/admin/order'
							className='text-primaryPurple text-sm md:text-base underline font-medium'>
							See All
						</Link>
					</div>

					{/* Table for md+ */}
					<div className='hidden md:block overflow-x-auto p-4 py-2'>
						<table className='w-full'>
							<thead>
								<tr className='text-left text-sm md:text-base bg-[#E5CFDD66]'>
									<th className='p-3 font-medium'>User ID</th>
									<th className='p-3 font-medium'>Product ID</th>
									<th className='p-3 font-medium'>Quantity</th>
									<th className='p-3 font-medium'>Price</th>
									<th className='p-3 font-medium'>Final Price</th>
									<th className='p-3 font-medium'>Date</th>
								</tr>
							</thead>
							<tbody className='text-sm md:text-base'>
								{loadingOrders ? (
									<tr>
										<td
											colSpan={6}
											className='text-center py-3'>
											Loading orders...
										</td>
									</tr>
								) : ordersError ? (
									<tr>
										<td
											colSpan={6}
											className='text-center text-red-500 py-3'>
											{ordersError}
										</td>
									</tr>
								) : orders.length > 0 ? (
									orders.slice(0, 5).map((order) => (
										<tr
											key={order.id}
											className='border-b border-gray-50'>
											<td className='py-3'>{order.orderId ?? 'N/A'}</td>
											<td className='py-3 text-gray-600'>
												{order.productId ?? 'N/A'}
											</td>
											<td className='py-3 text-gray-600'>
												{order.quantity ?? 0}
											</td>
											<td className='py-3'>₦{order.price?.toLocaleString()}</td>
											<td className='py-3'>
												₦{order.discountPrice?.toLocaleString()}
											</td>
											<td className='py-3'>
												{formatDate(order.dateTimeCreated)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={6}
											className='text-center py-3 text-gray-500'>
											No orders found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Mobile list */}
					<div className='md:hidden p-4 space-y-3'>
						{loadingOrders ? (
							<div className='text-center py-2'>Loading orders...</div>
						) : ordersError ? (
							<div className='text-center text-red-500 py-2'>{ordersError}</div>
						) : orders.length > 0 ? (
							orders.slice(0, 5).map((order) => (
								<div
									key={order.id}
									className='bg-gray-50 rounded-lg p-3'>
									<div className='flex items-start justify-between'>
										<div>
											<div className='font-medium'>
												Order: {order.orderId ?? 'N/A'}
											</div>
											<div className='text-xs text-gray-500'>
												Product: {order.productId ?? 'N/A'}
											</div>
											<div className='text-xs text-gray-500'>
												Qty: {order.quantity ?? 0}
											</div>
										</div>
										<div className='text-right'>
											<div className='font-medium'>
												₦{order.price?.toLocaleString()}
											</div>
											<div className='text-xs text-gray-500'>
												Final: ₦{order.discountPrice?.toLocaleString()}
											</div>
											<div className='text-xs text-gray-400 mt-1'>
												{formatDate(order.dateTimeCreated)}
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className='text-center text-gray-500 py-2'>
								No orders found.
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default AdminDashboard;
