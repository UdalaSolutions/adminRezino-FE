'use client';

import { orders } from '@/utils/utils';

const PaymentManagement = () => {
	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount);

	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});

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

	return (
		<section className='my-8 mx-2 md:mx-4 lg:mx-8'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
				<h1 className='text-2xl font-bold'>Payment Management</h1>
				<div className='flex flex-col sm:flex-row gap-3'>
					<button className='bg-transparent border border-primaryPurple rounded-lg py-2.5 px-5 flex gap-2 items-center text-primaryPurple font-medium hover:bg-purple-50 transition-colors'>
						Export
					</button>
				</div>
			</div>

			<div className='bg-white rounded-2xl shadow-sm w-full overflow-x-auto'>
				<div className='min-w-full'>
					{/* Table Header */}
					<div className='flex justify-between min-w-full px-4 py-5 font-medium border-b border-gray-200 w-full'>
						<div className='flex-1 pl-2 text-sm md:text-base lg:text-xl'>
							Customer Name
						</div>
						<div className='flex-1 text-sm md:text-base lg:text-xl'>Date</div>
						<div className='flex-1 text-sm md:text-base lg:text-xl'>Total</div>
						<div className='flex-1 text-sm md:text-base lg:text-xl'>Status</div>
					</div>
					{/* Table Body */}
					<div className='divide-y divide-gray-200 min-w-full'>
						{orders.map((order) => (
							<div
								key={order.id}
								className='flex justify-between min-w-full px-4 py-4 items-center hover:bg-gray-50'>
								<div className='flex-1 pl-2 font-medium text-sm md:text-base lg:text-xl truncate'>
									{order.customerName}
								</div>
								<div className='flex-1 text-sm md:text-base lg:text-xl'>
									{formatDate(order.date)}
								</div>
								<div className='flex-1 font-semibold text-sm md:text-base lg:text-xl'>
									{formatCurrency(order.total)}
								</div>
								<div className='flex-1'>
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(
											order.status
										)}`}>
										{order.status.charAt(0).toUpperCase() +
											order.status.slice(1)}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default PaymentManagement;
