'use client';

import { useState } from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';

// Logout Modal Component
const LogoutModal = ({
	isOpen,
	onClose,
	onConfirm,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}) => {
	const [isExiting, setIsExiting] = useState(false);

	const handleClose = () => {
		setIsExiting(true);
		setTimeout(() => {
			onClose();
			setIsExiting(false);
		}, 300);
	};

	const handleConfirm = () => {
		setIsExiting(true);
		setTimeout(() => {
			onConfirm();
			setIsExiting(false);
		}, 300);
	};

	if (!isOpen && !isExiting) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
					isOpen && !isExiting ? 'opacity-100' : 'opacity-0'
				}`}
				onClick={handleClose}>
				{/* Modal */}
				<div
					className={`bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 ${
						isOpen && !isExiting
							? 'scale-100 opacity-100'
							: 'scale-95 opacity-0'
					}`}
					onClick={(e) => e.stopPropagation()}>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-100'>
						<div className='flex items-center'>
							<div className='p-2 bg-red-100 rounded-full mr-3'>
								<AlertCircle
									className='text-red-600'
									size={24}
								/>
							</div>
							<h3 className='text-xl font-semibold text-gray-900'>
								Confirm Logout
							</h3>
						</div>
						<button
							onClick={handleClose}
							className='p-1 rounded-full hover:bg-gray-100 transition-colors'
							aria-label='Close'>
							<X
								size={20}
								className='text-gray-500'
							/>
						</button>
					</div>

					{/* Body */}
					<div className='p-6'>
						<p className='text-gray-600 mb-1'>
							Are you sure you want to logout?
						</p>
						<p className='text-sm text-gray-500'>
							You&apos;ll need to sign in again to access your account.
						</p>
					</div>

					{/* Footer */}
					<div className='flex justify-end space-x-3 p-6 border-t border-gray-100'>
						<button
							onClick={handleClose}
							className='px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200'>
							Cancel
						</button>
						<button
							onClick={handleConfirm}
							className='px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center'>
							<LogOut
								size={18}
								className='mr-2'
							/>
							Yes, Logout
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default LogoutModal;
