'use client';

import { useEffect, useMemo, useState } from 'react';
import { Modal, Spin, message } from 'antd';
import * as XLSX from 'xlsx';
import { Icon } from '@iconify/react';
import ProductPagination from '@/app/components/pagination/productPagination';
import { getAllOrders, OrderLine } from '@/services/admin';

const ORDERS_PER_PAGE = 10; // show 10 items per page to match payments pagination

const OrderManagement = () => {
	const [orders, setOrders] = useState<OrderLine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);

	// Modal state
	const [selected, setSelected] = useState<OrderLine | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getAllOrders();
				setOrders(Array.isArray(data) ? data : []);
			} catch (err: any) {
				console.error('fetch orders error', err);
				setError(err?.message ?? 'Failed to fetch orders');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	// Ensure current page is valid when orders change
	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [orders, currentPage]);

	// helper: convert different date shapes into timestamp
	const getTimeFromDateArray = (
		dateArray: number[] | string | number | Date | undefined
	) => {
		if (Array.isArray(dateArray)) {
			const [
				year = 1970,
				month = 1,
				day = 1,
				hour = 0,
				minute = 0,
				second = 0,
			] = dateArray;
			return new Date(year, month - 1, day, hour, minute, second).getTime();
		}
		if (!dateArray) return 0;
		return new Date(dateArray as any).getTime();
	};

	const sortedOrders = useMemo(() => {
		return [...orders].sort(
			(a, b) =>
				getTimeFromDateArray(b.dateTimeCreated) -
				getTimeFromDateArray(a.dateTimeCreated)
		);
	}, [orders]);

	const totalPages = Math.max(
		1,
		Math.ceil(sortedOrders.length / ORDERS_PER_PAGE)
	);
	const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
	const paginatedOrders = sortedOrders.slice(
		startIndex,
		startIndex + ORDERS_PER_PAGE
	);

	const toggleOrderSelection = (orderId: number) => {
		setSelectedOrders((prev) =>
			prev.includes(orderId)
				? prev.filter((id) => id !== orderId)
				: [...prev, orderId]
		);
	};

	const toggleSelectAll = () => {
		if (
			selectedOrders.length === paginatedOrders.length &&
			paginatedOrders.length > 0
		) {
			setSelectedOrders([]);
		} else {
			setSelectedOrders(paginatedOrders.map((o) => o.id));
		}
	};

	const formatCurrency = (amount?: number) =>
		new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount ?? 0);

	const formatDate = (dateArray?: number[] | string | number | Date) => {
		if (!dateArray) return 'N/A';
		if (Array.isArray(dateArray)) {
			const [
				year = 1970,
				month = 1,
				day = 1,
				hour = 0,
				minute = 0,
				second = 0,
			] = dateArray;
			const date = new Date(year, month - 1, day, hour, minute, second);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		}
		return new Date(dateArray as any).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Open detail modal
	const openDetail = (order: OrderLine) => {
		setSelected(order);
		setIsModalOpen(true);
	};

	const closeDetail = () => {
		setSelected(null);
		setIsModalOpen(false);
	};

	// Export orders to Excel
	const exportToExcel = async (rows: OrderLine[]) => {
		try {
			setExporting(true);

			const mapped = rows.map((r) => ({
				OrderId: r.id ?? '',
				UserId: (r as any).userId ?? (r as any).user ?? '',
				ProductIds: Array.isArray((r as any).productIds)
					? (r as any).productIds.join(',')
					: (r as any).productId ?? '',
				Quantity: (r as any).quantity ?? '',
				Price: (r as any).price ?? '',
				FinalPrice: (r as any).discountPrice ?? (r as any).finalPrice ?? '',
				Date: formatDate((r as any).dateTimeCreated),
			}));

			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(mapped);
			XLSX.utils.book_append_sheet(wb, ws, 'Orders');
			XLSX.writeFile(
				wb,
				`orders_${new Date().toISOString().slice(0, 10)}.xlsx`
			);
			message.success('Export started');
		} catch (err) {
			console.error('export error', err);
			message.error('Export failed');
		} finally {
			setExporting(false);
		}
	};

	const totalPending = useMemo(
		() =>
			orders.filter((o: any) => String(o.status).toLowerCase() === 'pending')
				.length,
		[orders]
	);

	if (error) {
		return (
			<p className='p-6 text-center text-red-600'>
				Failed to load orders: {error}
			</p>
		);
	}

	return (
		<section className='my-6 mx-2 md:mx-4 lg:mx-6'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
				<div>
					<p className='text-sm text-gray-500 mt-1'>
						Total orders:{' '}
						<span className='font-medium text-gray-700'>{orders.length}</span> •
						Pending:{' '}
						<span className='font-medium text-amber-700'>{totalPending}</span>
					</p>
				</div>

				<div className='flex flex-col sm:flex-row gap-3 items-stretch'>
					<button
						onClick={() => {
							if (selectedOrders.length > 0) {
								const rows = orders.filter((o) =>
									selectedOrders.includes(o.id)
								);
								exportToExcel(rows);
							} else {
								exportToExcel(orders);
							}
						}}
						disabled={orders.length === 0 || exporting}
						className='inline-flex items-center gap-2 bg-primaryPurple text-white! px-4 py-2 rounded-lg hover:opacity-95 transition'>
						<Icon
							icon='mdi:file-excel'
							width='18'
							height='18'
						/>
						{exporting
							? 'Exporting...'
							: selectedOrders.length > 0
							? `Export ${selectedOrders.length}`
							: 'Export'}
					</button>
				</div>
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
					<div className='col-span-3 hidden lg:block'>Total</div>
					<div className='col-span-1 text-right'>Actions</div>
				</div>

				{/* Table Body - Desktop */}
				<div className='hidden md:block'>
					<div className='divide-y divide-gray-200 w-full'>
						{loading ? (
							<div className='p-6 text-center'>
								<Spin />
							</div>
						) : paginatedOrders.length === 0 ? (
							<div className='p-6 text-center text-gray-500'>
								No orders found.
							</div>
						) : (
							paginatedOrders.map((order) => (
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
										User #{(order as any).userId ?? 'N/A'}
									</div>

									<div className='col-span-2'>
										{formatDate((order as any).dateTimeCreated)}
									</div>

									<div className='col-span-2 hidden md:block'>
										{(order as any).quantity ?? '-'}
									</div>

									<div className='col-span-3 hidden lg:block font-semibold '>
										{formatCurrency((order as any).price ?? 0)}
									</div>

									<div className='col-span-1 text-right'>
										<div className='flex items-center justify-end gap-2'>
											<button
												onClick={() => openDetail(order)}
												className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md hover:shadow-sm transition text-sm'>
												View
											</button>

											<button
												onClick={() => exportToExcel([order])}
												className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md hover:shadow-sm transition text-sm'>
												<Icon
													icon='mdi:file-excel'
													width='16'
													height='16'
												/>
												Export
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Mobile list */}
				<div className='md:hidden'>
					<div className='divide-y'>
						{loading ? (
							<div className='p-6 text-center'>
								<Spin />
							</div>
						) : paginatedOrders.length === 0 ? (
							<div className='p-6 text-center text-gray-500'>
								No orders found.
							</div>
						) : (
							paginatedOrders.map((order) => (
								<div
									key={order.id}
									className='p-4 flex flex-col gap-3'>
									<div className='flex items-start justify-between gap-3'>
										<div className='flex-1 min-w-0'>
											<div className='font-medium truncate'>
												Order #{order.id}
											</div>
											<div className='text-xs text-gray-500 truncate'>
												User #{(order as any).userId ?? 'N/A'}
											</div>
											<div className='text-xs text-gray-500'>
												{formatDate((order as any).dateTimeCreated)}
											</div>
										</div>

										<div className='text-right'>
											<div className='font-semibold'>
												{formatCurrency((order as any).price ?? 0)}
											</div>
										</div>
									</div>

									<div className='flex items-center justify-between'>
										<div className='text-xs text-gray-500'>
											Qty: {(order as any).quantity ?? '-'}
										</div>
										<div className='flex gap-2'>
											<button
												onClick={() => openDetail(order)}
												className='px-3 py-1 bg-white border rounded-md text-sm'>
												View
											</button>
											<button
												onClick={() => exportToExcel([order])}
												className='px-3 py-1 bg-white border rounded-md text-sm'>
												Export
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Pagination */}
			{sortedOrders.length > ORDERS_PER_PAGE && (
				<div className='mt-8'>
					<ProductPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={(page) => {
							const p = Math.max(1, Math.min(page, totalPages));
							setCurrentPage(p);
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}
					/>
				</div>
			)}

			{/* Details Modal */}
			<Modal
				title='Order Details'
				open={isModalOpen}
				onCancel={closeDetail}
				footer={
					<div className='flex justify-end gap-2'>
						<button
							onClick={() => {
								if (selected) exportToExcel([selected]);
							}}
							className='px-4 py-2 bg-white border rounded-md'>
							Export
						</button>
						<button
							onClick={closeDetail}
							className='px-4 py-2 bg-primaryPurple text-white! rounded-md'>
							Close
						</button>
					</div>
				}
				centered
				width={720}>
				{selected ? (
					<div className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<div className='text-xs text-gray-500'>Order ID</div>
								<div className='font-medium'>{selected.id}</div>
							</div>

							<div>
								<div className='text-xs text-gray-500'>User ID</div>
								<div className='font-medium'>
									{(selected as any).userId ?? 'N/A'}
								</div>
							</div>

							<div>
								<div className='text-xs text-gray-500'>Quantity</div>
								<div className='font-medium'>
									{(selected as any).quantity ?? 'N/A'}
								</div>
							</div>

							<div>
								<div className='text-xs text-gray-500'>Price</div>
								<div className='font-medium'>
									{formatCurrency((selected as any).price ?? 0)}
								</div>
							</div>

							<div className='md:col-span-2'>
								<div className='text-xs text-gray-500'>Date</div>
								<div className='font-medium'>
									{formatDate((selected as any).dateTimeCreated)}
								</div>
							</div>

							<div className='md:col-span-2'>
								<div className='text-xs text-gray-500'>Product IDs</div>
								<div className='font-medium'>
									{Array.isArray((selected as any).productIds)
										? (selected as any).productIds.join(', ')
										: (selected as any).productId ?? 'N/A'}
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='p-4 text-center'>
						<Spin />
					</div>
				)}
			</Modal>
		</section>
	);
};

export default OrderManagement;
