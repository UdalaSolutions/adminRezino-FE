'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	getAllNumberOfCustomers,
	getAllProductsSold,
	getAllProducts,
	getAllOrders,
} from '@/services/admin';

const AdminDashboard = () => {
	const [customerCount, setCustomerCount] = useState<number | null>(null);
	const [loadingCustomerCount, setLoadingCustomerCount] =
		useState<boolean>(false);
	const [customerError, setCustomerError] = useState<string | null>(null);

	const [productsSold, setProductsSold] = useState<number | null>(null);
	const [loadingProductsSold, setLoadingProductsSold] =
		useState<boolean>(false);
	const [productsSoldError, setProductsSoldError] = useState<string | null>(
		null
	);

	const [products, setProducts] = useState<any[]>([]);
	const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
	const [productsError, setProductsError] = useState<string | null>(null);

	const [orders, setOrders] = useState<any[]>([]);
	const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
	const [ordersError, setOrdersError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			setLoadingCustomerCount(true);
			setLoadingProductsSold(true);
			setLoadingProducts(true);
			setLoadingOrders(true);
			try {
				const [customers, sold, productList, ordersData] = await Promise.all([
					getAllNumberOfCustomers(),
					getAllProductsSold(),
					getAllProducts(),
					getAllOrders(),
				]);

				setCustomerCount(customers);
				setProductsSold(sold);
				setProducts(productList || []);
				setOrders(ordersData || []);
			} catch (error: any) {
				setCustomerError('Failed to fetch customers');
				setProductsSoldError('Failed to fetch products sold');
				setProductsError('Failed to fetch products');
				setOrdersError('Failed to fetch orders');
			} finally {
				setLoadingCustomerCount(false);
				setLoadingProductsSold(false);
				setLoadingProducts(false);
				setLoadingOrders(false);
			}
		};

		fetchDashboardData();
	}, []);

	const statsData = [
		{
			title: 'Orders',
			value: '1000',
			icon: '/Admin/shopping-cart.svg',
			bgColor: 'bg-primaryPurple',
		},
		{
			title: 'Sales',
			value: loadingProductsSold
				? 'Loading...'
				: productsSoldError
				? 'Error'
				: productsSold !== null
				? productsSold.toString()
				: '0',
			icon: '/Admin/money-recive.svg',
			bgColor: 'bg-primaryPurple',
		},
		{
			title: 'Customers',
			value: loadingCustomerCount
				? 'Loading...'
				: customerError
				? 'Error'
				: customerCount !== null
				? customerCount.toString()
				: '0',
			icon: '/Admin/user.svg',
			bgColor: 'bg-primaryPurple',
		},
		{
			title: 'Products',
			value: loadingProducts
				? 'Loading...'
				: productsError
				? 'Error'
				: products.length.toString(),
			icon: '/Admin/box.svg',
			bgColor: 'bg-primaryPurple',
		},
	];

	const recentPayments = [
		{
			customerName: 'Natha Almshabar',
			date: '31-Aug-2025',
			amount: '$500',
			status: 'Successful',
		},
		{
			customerName: 'Natha Almshabar',
			date: '31-Aug-2025',
			amount: '$500',
			status: 'Pending',
		},
		{
			customerName: 'Natha Almshabar',
			date: '31-Aug-2025',
			amount: '$500',
			status: 'Successful',
		},
		{
			customerName: 'Natha Almshabar',
			date: '31-Aug-2025',
			amount: '$500',
			status: 'Successful',
		},
	];

	const recentProducts = products.slice(0, 5);

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'successful':
			case 'delivered':
				return 'text-green-600';
			case 'pending':
			case 'processing':
				return 'text-orange-600';
			default:
				return 'text-gray-600';
		}
	};

	const formatDate = (dateArray: number[]) => {
		if (!Array.isArray(dateArray)) return 'N/A';
		const [year, month, day, hour, minute, second] = dateArray;
		const date = new Date(year, month - 1, day, hour, minute, second);
		return date.toLocaleString();
	};

	return (
		<section className='my-8 mx-2 md:mx-4 lg:mx-8'>
			<div className='space-y-8'>
				{/* Header */}
				<div className='text-left'>
					<h1 className='text-2xl font-bold '>Dashboard</h1>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
					{statsData.map((stat, index) => (
						<div
							key={index}
							className={`${stat.bgColor} rounded-xl p-6 text-white`}>
							<div className='flex flex-col space-y-2'>
								<Image
									src={stat.icon}
									alt={stat.title}
									width={60}
									height={60}
								/>
								<div className='flex flex-col space-y-2'>
									<p className='text-2xl md:text-[40px] font-semibold mt-1'>
										{stat.value}
									</p>
									<p className='text-white/80 text-xl font-medium'>
										{stat.title}
									</p>
								</div>
								{stat.title === 'Customers' && customerError && (
									<p className='text-red-200 text-xs mt-2'>{customerError}</p>
								)}
								{stat.title === 'Sales' && productsSoldError && (
									<p className='text-red-200 text-xs mt-2'>
										{productsSoldError}
									</p>
								)}
								{stat.title === 'Products' && productsError && (
									<p className='text-red-200 text-xs mt-2'>{productsError}</p>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Recent Payment */}
					<div className='bg-white rounded-xl shadow-sm '>
						<div className='flex items-center justify-between mb-6  p-6 pb-0'>
							<h2 className='text-lg md:text-xl font-semibold'>
								Recent Payment
							</h2>
							<Link
								href='/admin/payment'
								className='text-primaryPurple text-sm md:text-lg lg:text-xl underline font-medium'>
								See All
							</Link>
						</div>

						<div className='overflow-x-auto p-6 pt-0'>
							<table className='w-full'>
								<thead>
									<tr className='text-left text-base md:text-lg lg:text-xl bg-[#E5CFDD66]'>
										<th className='p-3 font-medium'>Customer Name</th>
										<th className='p-3 font-medium'>Date</th>
										<th className='p-3 font-medium'>Amount</th>
										<th className='p-3 font-medium'>Status</th>
									</tr>
								</thead>
								<tbody className='text-base md:text-lg lg:text-xl'>
									{recentPayments.map((payment, index) => (
										<tr
											key={index}
											className='border-b border-gray-50'>
											<td className='py-3 ml-2'>{payment.customerName}</td>
											<td className='py-3 text-gray-600 ml-2'>
												{payment.date}
											</td>
											<td className='py-3 ml-2'>{payment.amount}</td>
											<td className='py-3 ml-2'>
												<span
													className={`px-3 py-1 rounded-full text-base ml-2 md:text-lg lg:text-xl font-medium ${getStatusColor(
														payment.status
													)}`}>
													{payment.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Recent Products */}
					<div className='bg-white rounded-xl shadow-sm'>
						<div className='flex items-center justify-between mb-6  p-6 pb-0'>
							<h2 className='text-lg md:text-xl font-semibold'>
								Recent Products
							</h2>
							<Link
								href='/admin/product'
								className='text-primaryPurple text-sm md:text-lg lg:text-xl underline font-medium'>
								See All
							</Link>
						</div>

						<div className='overflow-x-auto p-6 pt-0'>
							<table className='w-full'>
								<thead>
									<tr className='text-left text-base  bg-[#E5CFDD66]'>
										<th className='p-3 font-medium'>Product Name</th>
										<th className='p-3 font-medium'>Category</th>
										<th className='p-3 font-medium'>Stock</th>
										<th className='p-3 font-medium'>Price</th>
									</tr>
								</thead>
								<tbody className='text-base '>
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
												₦{Number(product.productPrice).toLocaleString()}
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
					</div>
				</div>

				{/* Recent Orders - Updated */}
				<div className='bg-white rounded-xl shadow-sm'>
					<div className='flex items-center justify-between mb-6 p-6 pb-0'>
						<h2 className='text-lg md:text-xl font-semibold'>Recent Orders</h2>
						<Link
							href='/admin/order'
							className='text-primaryPurple text-sm md:text-lg lg:text-xl underline font-medium'>
							See All
						</Link>
					</div>

					<div className='overflow-x-auto p-6 pt-0'>
						<table className='w-full'>
							<thead>
								<tr className='text-left text-base md:text-lg lg:text-xl bg-[#E5CFDD66]'>
									<th className='p-3 font-medium'>User ID</th>
									<th className='p-3 font-medium'>Product ID</th>
									<th className='p-3 font-medium'>Quantity</th>
									<th className='p-3 font-medium'>Price</th>
									<th className='p-3 font-medium'>Final Price</th>
									<th className='p-3 font-medium'>Date</th>
								</tr>
							</thead>
							<tbody className='text-base md:text-lg lg:text-xl'>
								{loadingOrders ? (
									<tr>
										<td
											colSpan={8}
											className='text-center py-3'>
											Loading orders...
										</td>
									</tr>
								) : ordersError ? (
									<tr>
										<td
											colSpan={8}
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
											colSpan={8}
											className='text-center py-3 text-gray-500'>
											No orders found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AdminDashboard;
