'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllOrders, OrderLine } from '@/services/admin';
import ProductPagination from '@/app/components/pagination/productPagination';
import LoadingState from '@/app/components/LoadingState';

const OrderManagement = () => {
	const [orders, setOrders] = useState<OrderLine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const ordersPerPage = 7;

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getAllOrders();
				setOrders(data);
			} catch (err: any) {
				setError(err.message || 'Failed to fetch orders');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	const getTimeFromDateArray = (
		dateArray: number[] | string | number | Date
	) => {
		// If the backend returns a date array like [year, month, day, hour, minute, second]
		// convert it to a proper Date (month is 1-based in the array so subtract 1).
		if (Array.isArray(dateArray)) {
			const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] =
				dateArray;
			return new Date(year, month - 1, day, hour, minute, second).getTime();
		}
		// Otherwise rely on Date constructor for strings/numbers/Date objects.
		return new Date(dateArray as any).getTime();
	};

	const sortedOrders = useMemo(() => {
		return [...orders].sort(
			(a, b) =>
				getTimeFromDateArray(b.dateTimeCreated) -
				getTimeFromDateArray(a.dateTimeCreated)
		);
	}, [orders]);

	const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
	const startIndex = (currentPage - 1) * ordersPerPage;
	const paginatedOrders = sortedOrders.slice(
		startIndex,
		startIndex + ordersPerPage
	);

	const toggleOrderSelection = (orderId: number) => {
		setSelectedOrders((prev) =>
			prev.includes(orderId)
				? prev.filter((id) => id !== orderId)
				: [...prev, orderId]
		);
	};

	const toggleSelectAll = () => {
		if (selectedOrders.length === paginatedOrders.length) {
			setSelectedOrders([]);
		} else {
			setSelectedOrders(paginatedOrders.map((o) => o.id));
		}
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount);

	const formatDate = (dateArray: number[]) => {
		const [year, month, day, hour, minute, second] = dateArray;
		const date = new Date(year, month - 1, day, hour, minute, second);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'text-yellow-800';
			case 'successful':
				return 'text-green-800';
			case 'cancelled':
				return 'text-red-800';
			default:
				return 'text-gray-800';
		}
	};

	if (loading) {
		return (
			<div className='py-5 sm:py-10 md:py-16'>
				<LoadingState />
			</div>
		);
	}

	if (error) {
		return (
			<p className='p-6 text-center text-red-600'>
				Failed to load orders: {error}
			</p>
		);
	}

	return (
		<section className='my-8 mx-2 md:mx-4 lg:mx-8.5'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
				<h1 className='text-2xl font-bold text-gray-800'>Order Management</h1>
				<button className='bg-transparent border border-primaryPurple rounded-lg py-2.5 px-5 text-primaryPurple font-medium hover:bg-purple-50 transition-colors'>
					Export
				</button>
			</div>

			<div className='bg-white rounded-2xl overflow-hidden shadow-sm w-full'>
				{/* Table Header */}
				<div className='grid grid-cols-12 px-4 py-5 font-medium border-b border-gray-200 w-full'>
					<div className='col-span-1 flex items-center justify-center'>
						<input
							type='checkbox'
							checked={
								selectedOrders.length === paginatedOrders.length &&
								paginatedOrders.length > 0
							}
							onChange={toggleSelectAll}
							className='h-4 w-4 text-primaryPurple rounded focus:ring-primaryPurple'
						/>
					</div>
					<div className='col-span-3'>Customer ID</div>
					<div className='col-span-2'>Date</div>
					<div className='col-span-2 hidden md:block'>Quantity</div>
					<div className='col-span-2 hidden lg:block'>Total</div>
					<div className='col-span-2'>Status</div>
				</div>

				{/* Table Body */}
				<div className='divide-y divide-gray-200 w-full'>
					{paginatedOrders.map((order) => (
						<div
							key={order.id}
							className='grid grid-cols-12 px-4 py-4 items-center hover:bg-gray-50 w-full'>
							<div className='col-span-1 flex items-center justify-center'>
								<input
									type='checkbox'
									checked={selectedOrders.includes(order.id)}
									onChange={() => toggleOrderSelection(order.id)}
									className='h-4 w-4 text-primaryPurple rounded focus:ring-primaryPurple'
								/>
							</div>
							<div className='col-span-3 font-medium truncate'>
								User #{order.userId}
							</div>
							<div className='col-span-2'>
								{formatDate(order.dateTimeCreated)}
							</div>
							<div className='col-span-2 hidden md:block'>{order.quantity}</div>
							<div className='col-span-2 hidden lg:block font-semibold'>
								{formatCurrency(order.price)}
							</div>
							<div className='col-span-2'>
								<span
									className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold ${getStatusColor(
										'successful'
									)}`}>
									Successful
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='mt-8'>
					<ProductPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</section>
	);
};

export default OrderManagement;
