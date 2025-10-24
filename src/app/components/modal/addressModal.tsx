'use client';

import React, { useState } from 'react';

const AddressModal: React.FC<{
	open: boolean;
	onClose: () => void;
	onSave: (address: string) => Promise<void> | void;
	initialValue?: string;
}> = ({ open, onClose, onSave, initialValue = '' }) => {
	const [address, setAddress] = useState(initialValue);
	const [isSaving, setIsSaving] = useState(false);

	if (!open) return null;

	const handleSave = async () => {
		if (!address.trim()) return;
		setIsSaving(true);
		try {
			await onSave(address.trim());
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='fixed inset-0 bg-black/40 bg-opacity-30 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
				<h2 className='text-lg font-semibold mb-4'>
					{initialValue ? 'Edit' : 'Add'} Address
				</h2>
				<textarea
					className='w-full border rounded-lg p-2 mb-4'
					rows={3}
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					placeholder='Enter address'
					disabled={isSaving}
				/>
				<div className='flex justify-end space-x-2'>
					<button
						className='px-4 py-2 bg-gray-200 rounded'
						onClick={onClose}
						disabled={isSaving}>
						Cancel
					</button>
					<button
						className='px-4 py-2 bg-primaryPurple text-white rounded flex items-center justify-center'
						onClick={handleSave}
						disabled={isSaving || !address.trim()}>
						{isSaving ? (
							<span className='flex items-center gap-2'>
								<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></span>
								Saving...
							</span>
						) : (
							'Save'
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddressModal;
