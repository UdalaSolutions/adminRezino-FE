export async function uploadImageToCloudinary(file: File): Promise<string> {
	const cloudName = 'dniex6cog';
	const uploadPreset = 'product_uploads';

	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', uploadPreset);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
		{
			method: 'POST',
			body: formData,
		}
	);

	const data = await res.json();
	if (!res.ok || !data.secure_url)
		throw new Error(data.error?.message || 'Upload failed');
	return data.secure_url;
}
