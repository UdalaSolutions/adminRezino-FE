'use client';

// import { useRouter } from 'next/navigation';

interface OrderConfirmationModalProps {
	isOpen: boolean;
	onClose?: () => void;
}

const OrderConfirmationModal = ({
	isOpen,
	onClose,
}: OrderConfirmationModalProps) => {
	// const router = useRouter();

	const handleContinue = () => {
		if (onClose) {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white p-8 rounded-lg text-center max-w-md w-full mx-4'>
				<div className='text-5xl text-green-500 mb-4'>✓</div>
				<h2 className='text-2xl font-bold mb-4'>Payment Successful!</h2>
				<p className='text-gray-600 mb-6'>
					Your order has been placed successfully.
				</p>

				<button
					onClick={handleContinue}
					className='w-full bg-primaryPurple text-white py-3 px-6 rounded-lg hover:bg-primaryPurple/90 transition-colors font-semibold'>
					Continue to Homepage
				</button>
			</div>
		</div>
	);
};

export default OrderConfirmationModal;
