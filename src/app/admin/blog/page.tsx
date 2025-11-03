/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Spin, Button, Input, Upload, message, Tooltip } from 'antd';
import {
	PlusOutlined,
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import {
	fetchAllBlogPosts,
	createOrUpdateBlogPost,
	deleteBlogPost,
	BlogPost,
	FormData as BlogFormData,
} from '@/services/admin';
import { uploadImageToCloudinary } from '@/cloudinaryUpload';
import { toast } from 'react-toastify';
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

type ModalMode = 'create' | 'edit' | 'view';

const { TextArea } = Input;

const BlogManagementPage: React.FC = () => {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// Modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<ModalMode>('create');
	const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

	// Form state
	const [form, setForm] = useState<BlogFormData>({
		title: '',
		content: '',
		imageUrl: '',
		videoUrl: '',
	});
	const [errors, setErrors] = useState<{ title?: string; content?: string }>(
		{}
	);
	const [imageUploading, setImageUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	// Fetch posts
	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const result = await fetchAllBlogPosts();
			setPosts(Array.isArray(result) ? result : []);
		} catch (err: any) {
			console.error('fetchAllBlogPosts error', err);
			toast.error(err?.message ?? 'Failed to fetch posts');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	// Helpers
	const resetForm = () => {
		setForm({ title: '', content: '', imageUrl: '', videoUrl: '' });
		setErrors({});
	};

	const openModal = (mode: ModalMode, post: BlogPost | null = null) => {
		setModalMode(mode);
		setSelectedPost(post);
		if (mode === 'create') {
			resetForm();
		} else if (post) {
			setForm({
				title: post.title ?? '',
				content: post.content ?? '',
				imageUrl: post.imageUrl ?? '',
				videoUrl: post.videoUrl ?? '',
			});
			setErrors({});
		}
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedPost(null);
		resetForm();
	};

	const formatDate = (dateArr?: number[] | null) => {
		if (!dateArr || !Array.isArray(dateArr)) return 'N/A';
		const [y, m, d, h = 0, min = 0, s = 0] = dateArr;
		const dt = new Date(y, m - 1, d, h, min, s);
		return dt.toLocaleString();
	};

	// Image upload handler (Cloudinary helper)
	const handleImageFile = async (file: File | null) => {
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			message.error('Please select an image file');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			message.error('Image must be smaller than 5MB');
			return;
		}
		try {
			setImageUploading(true);
			const url = await uploadImageToCloudinary(file);
			setForm((f) => ({ ...f, imageUrl: url }));
			message.success('Image uploaded');
		} catch (err) {
			console.error('uploadImageToCloudinary error', err);
			message.error('Upload failed');
		} finally {
			setImageUploading(false);
		}
	};

	// Controlled input change
	const handleChange = (k: keyof BlogFormData, v: string) => {
		setForm((prev) => ({ ...prev, [k]: v }));
		if (errors[k as keyof typeof errors]) {
			setErrors((e) => ({ ...e, [k]: undefined }));
		}
	};

	// Submit create/edit
	const handleSubmit = async () => {
		const trimmedTitle = form.title?.trim() ?? '';
		const trimmedContent = form.content?.trim() ?? '';
		const newErrors: typeof errors = {};
		if (!trimmedTitle) newErrors.title = 'Title is required';
		if (!trimmedContent) newErrors.content = 'Content is required';
		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			return;
		}

		setSaving(true);
		try {
			const payload = { ...form };
			if (modalMode !== 'create' && modalMode !== 'edit') return;
			const id =
				modalMode === 'edit' && selectedPost ? selectedPost.id : undefined;
			const res = await createOrUpdateBlogPost(payload, modalMode, id);
			if (res?.successfully) {
				message.success(
					modalMode === 'create' ? 'Post created' : 'Post updated'
				);
				await fetchPosts();
				closeModal();
			} else {
				message.error(res?.message ?? 'Operation failed');
			}
		} catch (err: any) {
			console.error('createOrUpdateBlogPost error', err);
			message.error(err?.message ?? 'Save failed');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (postId: number) => {
		if (!confirm('Delete this post?')) return;
		setDeletingId(postId);
		try {
			const res = await deleteBlogPost(postId);
			if (res?.successfully) {
				message.success('Post deleted');
				await fetchPosts();
			} else {
				message.error(res?.message ?? 'Delete failed');
			}
		} catch (err: any) {
			console.error('deleteBlogPost error', err);
			message.error(err?.message ?? 'Delete failed');
		} finally {
			setDeletingId(null);
		}
	};

	// Derived values
	const recentCount = useMemo(() => posts.length, [posts]);

	// Small Card component (inline to avoid file noise)
	const Card: React.FC<{ post: BlogPost }> = ({ post }) => {
		return (
			<article className='group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1'>
				<div className='relative w-full h-48 bg-gray-50'>
					{post.imageUrl ? (
						<img
							src={post.imageUrl}
							alt={post.title}
							className='w-full h-full object-cover'
						/>
					) : (
						<div className='w-full h-full flex items-center justify-center text-gray-300'>
							<PhotoIcon className='w-12 h-12' />
						</div>
					)}
					{post.videoUrl && (
						<div className='absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-full flex items-center gap-2 shadow'>
							<VideoCameraIcon className='w-4 h-4 text-primaryPurple' />
							<span className='text-xs text-primaryPurple'>Video</span>
						</div>
					)}
				</div>

				<div className='p-4'>
					<h3 className='font-semibold text-lg leading-snug mb-2 line-clamp-2 text-gray-900'>
						{post.title}
					</h3>
					<p className='text-sm text-gray-600 mb-4 line-clamp-3'>
						{post.content}
					</p>

					<div className='flex items-center justify-between gap-3'>
						<div className='text-xs text-gray-500'>
							{formatDate(post.dateCreated)}
						</div>
						<div className='flex items-center gap-2'>
							<Tooltip title='View'>
								<Button
									onClick={() => openModal('view', post)}
									type='default'
									icon={<EyeOutlined />}
									size='small'
								/>
							</Tooltip>
							<Tooltip title='Edit'>
								<Button
									onClick={() => openModal('edit', post)}
									type='default'
									icon={<EditOutlined />}
									size='small'
								/>
							</Tooltip>
							<Tooltip title='Delete'>
								<Button
									danger
									onClick={() => handleDelete(post.id)}
									loading={deletingId === post.id}
									icon={<DeleteOutlined />}
									size='small'
								/>
							</Tooltip>
						</div>
					</div>
				</div>
			</article>
		);
	};

	return (
		<main className='my-6 mx-2 md:mx-4 lg:mx-6'>
			<div className='mb-6'>
				<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
					<div>
						<div className='inline-flex items-center gap-2 bg-primaryPurple text-white! px-3 py-1 rounded-full text-sm font-medium mb-2'>
							<PhotoIcon className='w-4 h-4' />
							Content
						</div>
						<h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
							Blog Management
						</h1>
						<div className='text-sm text-gray-500 mt-1'>
							{recentCount} posts
						</div>
					</div>

					<div className='flex gap-3'>
						<Button
							icon={<PlusOutlined />}
							className='bg-primary!'
							onClick={() => openModal('create')}>
							Create Post
						</Button>
					</div>
				</div>
			</div>

			<section className='bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100'>
				{loading ? (
					<div className='flex items-center justify-center py-16'>
						<Spin size='large' />
					</div>
				) : posts.length === 0 ? (
					<div className='py-16 text-center'>
						<div className='mx-auto w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center mb-6'>
							<PhotoIcon className='w-12 h-12 text-primaryPurple' />
						</div>
						<h3 className='text-lg font-semibold mb-2'>No blog posts yet</h3>
						<p className='text-sm text-gray-500 mb-4'>
							Create your first post to get started.
						</p>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => openModal('create')}>
							Create Post
						</Button>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{posts.map((p) => (
							<Card
								key={p.id}
								post={p}
							/>
						))}
					</div>
				)}
			</section>

			{/* Modal - using Antd for consistent UI */}
			<Modal
				open={modalOpen}
				onCancel={closeModal}
				title={
					modalMode === 'create'
						? 'Create Blog Post'
						: modalMode === 'edit'
						? 'Edit Blog Post'
						: 'View Post'
				}
				footer={
					modalMode === 'view'
						? [
								<Button
									key='close'
									onClick={closeModal}>
									Close
								</Button>,
						  ]
						: [
								<Button
									key='cancel'
									onClick={closeModal}>
									Cancel
								</Button>,
								<Button
									key='save'
									type='primary'
									loading={saving}
									onClick={handleSubmit}>
									{modalMode === 'create' ? 'Create Post' : 'Save Changes'}
								</Button>,
						  ]
				}
				width={800}
				centered>
				{modalMode === 'view' && selectedPost ? (
					<div className='space-y-4'>
						{selectedPost.imageUrl && (
							<div className='rounded-lg overflow-hidden'>
								<img
									src={selectedPost.imageUrl}
									alt={selectedPost.title}
									className='w-full object-cover max-h-80'
								/>
							</div>
						)}

						<h2 className='text-xl font-semibold'>{selectedPost.title}</h2>
						<div className='text-sm text-gray-500 mb-4'>
							{formatDate(selectedPost.dateCreated)}
						</div>
						<div className='prose max-w-none whitespace-pre-wrap text-gray-700'>
							{selectedPost.content}
						</div>

						{selectedPost.videoUrl && (
							<div className='mt-4'>
								<a
									href={selectedPost.videoUrl}
									target='_blank'
									rel='noreferrer'
									className='text-primaryPurple hover:underline'>
									<VideoCameraIcon className='inline-block w-4 h-4 mr-2' />
									Open Video
								</a>
							</div>
						)}
					</div>
				) : (
					// Create/Edit form
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Title <span className='text-red-500'>*</span>
							</label>
							<Input
								value={form.title}
								onChange={(e) => handleChange('title', e.target.value)}
							/>
							{errors.title && (
								<div className='text-xs text-red-500 mt-1'>{errors.title}</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Content <span className='text-red-500'>*</span>
							</label>
							<TextArea
								rows={8}
								value={form.content}
								onChange={(e) => handleChange('content', e.target.value)}
							/>
							{errors.content && (
								<div className='text-xs text-red-500 mt-1'>
									{errors.content}
								</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Featured image
							</label>

							<div className='flex gap-3 items-start'>
								<Upload
									accept='image/*'
									showUploadList={false}
									beforeUpload={(file) => {
										// intercept upload, upload via cloudinary helper
										handleImageFile(file);
										// prevent default antd upload behavior
										return false;
									}}>
									<Button
										icon={<UploadOutlined />}
										loading={imageUploading}>
										Upload image
									</Button>
								</Upload>

								<Input
									placeholder='or paste image URL'
									value={form.imageUrl}
									onChange={(e) => handleChange('imageUrl', e.target.value)}
								/>
							</div>

							{form.imageUrl && (
								<div className='mt-3'>
									<div className='relative rounded-lg overflow-hidden border'>
										<img
											src={form.imageUrl}
											alt='preview'
											className='w-full object-cover max-h-48'
										/>
										<Button
											danger
											onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}
											style={{ position: 'absolute', right: 8, top: 8 }}
											size='small'>
											Remove
										</Button>
									</div>
								</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Video URL (optional)
							</label>
							<Input
								value={form.videoUrl}
								onChange={(e) => handleChange('videoUrl', e.target.value)}
								placeholder='https://youtube.com/...'
							/>
						</div>
					</div>
				)}
			</Modal>
		</main>
	);
};

export default BlogManagementPage;
