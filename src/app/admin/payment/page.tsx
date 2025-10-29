'use client';

import { useEffect, useMemo, useState } from 'react';
import { Modal, Spin, message } from 'antd';
import { Icon } from '@iconify/react';
import * as XLSX from 'xlsx';
import { getAllPayments, Transaction } from '@/services/admin';
import ProductPagination from '@/app/components/pagination/productPagination';

const ITEMS_PER_PAGE = 10;

const PaymentManagement = () => {
	const [payments, setPayments] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [selected, setSelected] = useState<Transaction | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [exporting, setExporting] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getAllPayments();
				setPayments(Array.isArray(data) ? data : []);
			} catch (err: any) {
				console.error('fetch payments error', err);
				setError(err?.message ?? 'Failed to fetch payments');
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, []);

	// Ensure current page is valid whenever payments change
	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil(payments.length / ITEMS_PER_PAGE));
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [payments, currentPage]);

	const totalPages = Math.max(1, Math.ceil(payments.length / ITEMS_PER_PAGE));
	const pagedPayments = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return payments.slice(start, start + ITEMS_PER_PAGE);
	}, [payments, currentPage]);

	const formatCurrency = (amount?: number) =>
		new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount ?? 0);

	const formatPaidAt = (paidAt?: number[] | null) => {
		if (!Array.isArray(paidAt) || paidAt.length < 3) return 'N/A';
		const [year, month, day, hour = 0, minute = 0, second = 0] = paidAt;
		const dt = new Date(year, month - 1, day, hour, minute, second);
		return dt.toLocaleString();
	};

	const getStatusColor = (status?: string) => {
		switch (String(status).toLowerCase()) {
			case 'pending':
				return 'text-yellow-800 bg-yellow-50';
			case 'successful':
				return 'text-green-800 bg-green-50';
			case 'cancelled':
				return 'text-red-800 bg-red-50';
			default:
				return 'text-gray-800 bg-gray-50';
		}
	};

	// Short email formatting e.g. "gbenmoese@..."
	const formatShortEmail = (email?: string, maxLocal = 10) => {
		if (!email) return '—';
		if (!email.includes('@')) {
			return email.length > maxLocal ? `${email.slice(0, maxLocal)}...` : email;
		}
		const [local] = email.split('@');
		const shortLocal =
			local.length > maxLocal ? `${local.slice(0, maxLocal)}...` : local;
		return `${shortLocal}@...`;
	};

	const openDetail = (p: Transaction) => {
		setSelected(p);
		setIsModalOpen(true);
	};

	const closeDetail = () => {
		setIsModalOpen(false);
		setSelected(null);
	};

	const exportToExcel = async (rows: Transaction[]) => {
		try {
			setExporting(true);

			// Normalize & map to friendly shape
			const mapped = rows.map((r) => ({
				Reference: r.paystackReference ?? '',
				Email: r.userEmail ?? '',
				Amount: r.amount ?? 0,
				Status: r.status ?? '',
				'Paid At': formatPaidAt(r.paidAt),
				'Order Ids': Array.isArray(r.orderIds) ? r.orderIds.join(',') : '',
			}));

			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(mapped);
			XLSX.utils.book_append_sheet(wb, ws, 'Payments');

			// use writeFile to trigger download in browser
			XLSX.writeFile(
				wb,
				`payments_${new Date().toISOString().slice(0, 10)}.xlsx`
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
			payments.filter((p) => String(p.status).toLowerCase() === 'pending')
				.length,
		[payments]
	);

	return (
		<section className='my-6 mx-2 md:mx-4 lg:mx-6'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
				<div>
					<p className='text-sm text-gray-500 mt-1'>
						Total transactions:{' '}
						<span className='font-medium text-gray-700'>{payments.length}</span>{' '}
						• Pending:{' '}
						<span className='font-medium text-amber-700'>{totalPending}</span>
					</p>
				</div>

				<div className='flex flex-col sm:flex-row gap-3 items-stretch'>
					<button
						onClick={() => exportToExcel(payments)}
						disabled={payments.length === 0 || exporting}
						className='inline-flex items-center gap-2 bg-primaryPurple text-white! px-4 py-2 rounded-lg hover:opacity-95 transition'>
						<Icon
							icon='mdi:file-excel'
							width='18'
							height='18'
						/>
						{exporting ? 'Exporting...' : 'Export'}
					</button>
				</div>
			</div>

			<div className='bg-white rounded-2xl shadow-sm w-full overflow-hidden'>
				{/* Desktop table */}
				<div className='hidden md:block'>
					<div className='w-full overflow-x-auto'>
						<table className='w-full table-auto'>
							<thead>
								<tr className='bg-[#F7F7FB]'>
									<th className='text-left p-4 font-medium'>Reference</th>
									<th className='text-left p-4 font-medium'>Customer Email</th>
									<th className='text-left p-4 font-medium'>Amount</th>
									<th className='text-left p-4 font-medium'>Status</th>
									<th className='text-left p-4 font-medium'>Paid At</th>
									<th className='text-right p-4 font-medium'>Actions</th>
								</tr>
							</thead>

							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan={6}
											className='p-6 text-center'>
											<Spin />
										</td>
									</tr>
								) : error ? (
									<tr>
										<td
											colSpan={6}
											className='p-6 text-center text-red-500'>
											{error}
										</td>
									</tr>
								) : payments.length === 0 ? (
									<tr>
										<td
											colSpan={6}
											className='p-6 text-center text-gray-500'>
											No payments found.
										</td>
									</tr>
								) : (
									pagedPayments.map((p) => (
										<tr
											key={p.id}
											className='border-b last:border-b-0 hover:bg-gray-50'>
											<td className='p-4 align-middle'>
												<div className='font-medium'>{p.paystackReference}</div>
											</td>

											<td className='p-4 align-middle max-w-[220px]'>
												<div className='truncate text-sm text-gray-700'>
													{formatShortEmail(p.userEmail)}
												</div>
											</td>

											<td className='p-4 align-middle'>
												<div className='font-semibold'>
													{formatCurrency(p.amount)}
												</div>
											</td>

											<td className='p-4 align-middle'>
												<span
													className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
														p.status
													)}`}>
													{String(p.status).charAt(0).toUpperCase() +
														String(p.status).slice(1)}
												</span>
											</td>

											<td className='p-4 align-middle'>
												<div className='text-sm text-gray-600'>
													{formatPaidAt(p.paidAt)}
												</div>
											</td>

											<td className='p-4 align-middle text-right'>
												<div className='flex justify-end items-center gap-2'>
													<button
														onClick={() => openDetail(p)}
														className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md hover:shadow-sm transition text-sm'>
														View
													</button>

													<button
														onClick={() => exportToExcel([p])}
														className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md hover:shadow-sm transition text-sm'>
														<Icon
															icon='mdi:file-excel'
															width='16'
															height='16'
														/>
														Export
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Mobile list */}
				<div className='md:hidden'>
					{loading ? (
						<div className='p-6 text-center'>
							<Spin />
						</div>
					) : error ? (
						<div className='p-6 text-center text-red-500'>{error}</div>
					) : payments.length === 0 ? (
						<div className='p-6 text-center text-gray-500'>
							No payments found.
						</div>
					) : (
						<div className='divide-y'>
							{pagedPayments.map((p) => (
								<div
									key={p.id}
									className='p-4 flex flex-col gap-3'>
									<div className='flex items-start justify-between gap-3'>
										<div className='flex-1 min-w-0'>
											<div className='font-medium truncate'>
												{p.paystackReference}
											</div>
											<div className='text-xs text-gray-500 truncate'>
												{formatShortEmail(p.userEmail)}
											</div>
										</div>

										<div className='text-right'>
											<div className='font-semibold'>
												{formatCurrency(p.amount)}
											</div>
											<div
												className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
													p.status
												)}`}>
												{String(p.status).charAt(0).toUpperCase() +
													String(p.status).slice(1)}
											</div>
										</div>
									</div>

									<div className='flex items-center justify-between'>
										<div className='text-xs text-gray-500'>
											{formatPaidAt(p.paidAt)}
										</div>
										<div className='flex gap-2'>
											<button
												onClick={() => openDetail(p)}
												className='px-3 py-1 bg-white border rounded-md text-sm'>
												View
											</button>
											<button
												onClick={() => exportToExcel([p])}
												className='px-3 py-1 bg-white border rounded-md text-sm'>
												Export
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Pagination */}
			{payments.length > ITEMS_PER_PAGE && (
				<div className='mt-6'>
					<ProductPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={(page) => {
							if (page < 1) page = 1;
							if (page > totalPages) page = totalPages;
							setCurrentPage(page);
							// scroll to top of table for better UX on page change
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}
					/>
				</div>
			)}

			{/* Details Modal (Antd) */}
			<Modal
				title='Payment Details'
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
								<div className='text-xs text-gray-500'>Reference</div>
								<div className='font-medium'>{selected.paystackReference}</div>
							</div>

							<div>
								<div className='text-xs text-gray-500'>Customer Email</div>
								<div className='font-medium'>{selected.userEmail}</div>
							</div>

							<div>
								<div className='text-xs text-gray-500'>Amount</div>
								<div className='font-medium'>
									{formatCurrency(selected.amount)}
								</div>
							</div>

							<div>
								<div className='text-xs text-gray-500'>Status</div>
								<div
									className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
										selected.status
									)}`}>
									{String(selected.status).charAt(0).toUpperCase() +
										String(selected.status).slice(1)}
								</div>
							</div>

							<div className='md:col-span-2'>
								<div className='text-xs text-gray-500'>Paid At</div>
								<div className='font-medium'>
									{formatPaidAt(selected.paidAt)}
								</div>
							</div>

							<div className='md:col-span-2'>
								<div className='text-xs text-gray-500'>Order IDs</div>
								<div className='font-medium'>
									{Array.isArray(selected.orderIds) &&
									selected.orderIds.length > 0
										? selected.orderIds.join(', ')
										: 'N/A'}
								</div>
							</div>

							<div className='md:col-span-2'>
								<div className='text-xs text-gray-500'>Raw Data</div>
								<pre className='text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48'>
									{JSON.stringify(selected, null, 2)}
								</pre>
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

export default PaymentManagement;
