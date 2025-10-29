/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	EyeIcon,
	XMarkIcon,
	PhotoIcon,
	VideoCameraIcon,
	CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { uploadImageToCloudinary } from '@/cloudinaryUpload';
import {
	fetchAllBlogPosts,
	createOrUpdateBlogPost,
	deleteBlogPost,
	BlogPost,
	FormData,
} from '@/services/admin';
import { toast } from 'react-toastify';
interface FormErrors {
	title?: string;
	content?: string;
}

type ModalMode = 'create' | 'edit' | 'view';

const BlogManagement: React.FC = () => {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalMode, setModalMode] = useState<ModalMode>('create');
	const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
	const [formData, setFormData] = useState<FormData>({
		title: '',
		content: '',
		imageUrl: '',
		videoUrl: '',
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [imageUploading, setImageUploading] = useState<boolean>(false);

	// Fetch Posts
	const fetchPosts = useCallback(async () => {
		try {
			setLoading(true);
			const posts = await fetchAllBlogPosts();
			setPosts(posts);
		} catch (error: any) {
			toast.error(error?.message || 'Error fetching posts');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	// Format Date
	const formatDate = (dateArr: number[]) => {
		if (!dateArr || dateArr.length < 6) return 'Invalid Date';
		const [year, month, day, hour, min, sec] = dateArr;
		const date = new Date(year, month - 1, day, hour, min, sec);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Handle image upload
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			toast.warn('No file selected');
			return;
		}
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error('Image size should be less than 5MB');
			return;
		}
		try {
			setImageUploading(true);
			const imageUrl = await uploadImageToCloudinary(file);
			setFormData((prev) => ({ ...prev, imageUrl }));
			toast.success('Image uploaded successfully!');
		} catch (error) {
			toast.error('Error uploading image. Please try again.');
			console.error(error);
		} finally {
			setImageUploading(false);
		}
	};

	// Modal handlers
	const openModal = (mode: ModalMode, post: BlogPost | null = null) => {
		setModalMode(mode);
		setSelectedPost(post);
		if (mode === 'create') {
			setFormData({ title: '', content: '', imageUrl: '', videoUrl: '' });
		} else if (post) {
			setFormData({
				title: post.title || '',
				content: post.content || '',
				imageUrl: post.imageUrl || '',
				videoUrl: post.videoUrl || '',
			});
		}
		setShowModal(true);
		setErrors({});
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedPost(null);
		setFormData({ title: '', content: '', imageUrl: '', videoUrl: '' });
		setErrors({});
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	// Submit handler (Create/Edit)
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		const newErrors: FormErrors = {};
		if (!formData.title.trim()) newErrors.title = 'Title is required';
		if (!formData.content.trim()) newErrors.content = 'Content is required';
		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			return;
		}
		try {
			if (modalMode !== 'create' && modalMode !== 'edit') return;
			const result = await createOrUpdateBlogPost(
				formData,
				modalMode,
				selectedPost?.id
			);
			if (result.successfully) {
				await fetchPosts();
				closeModal();
				toast.success(
					`Blog post ${
						modalMode === 'create' ? 'created' : 'updated'
					} successfully!`
				);
			} else {
				toast.error(result.message || 'Operation failed');
			}
		} catch (error: any) {
			toast.error(error?.message || 'Error saving post');
		}
	};

	// Delete handler
	const handleDelete = async (postId: number) => {
		if (!window.confirm('Are you sure you want to delete this blog post?'))
			return;
		try {
			const result = await deleteBlogPost(postId);
			if (result.successfully) {
				await fetchPosts();
				toast.success('Blog post deleted successfully!');
			} else {
				toast.error(result.message || 'Delete operation failed');
			}
		} catch (error: any) {
			toast.error(error?.message || 'Error deleting post');
		}
	};

	if (loading) {
		return (
			<section className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex justify-center items-center h-96'>
						<div className='relative'>
							<div className='animate-spin rounded-full h-16 w-16 border-4 border-purple-200'></div>
							<div className='animate-spin rounded-full h-16 w-16 border-4 border-t-primaryPurple absolute top-0 left-0'></div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className='min-h-screen my-6 mx-2 md:mx-4 lg:mx-6'>
			<div className=''>
				{/* Header Section */}
				<div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8'>
					<div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6'>
						<div className='flex-1'>
							<div className='inline-flex items-center gap-2 bg-gradient-to-r from-primaryPurple to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-3'>
								<PhotoIcon className='w-4 h-4' />
								Content Management
							</div>
							<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primaryPurple via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2'>
								Blog Management
							</h1>
							<p className='text-gray-600 text-sm sm:text-base max-w-2xl'>
								Create engaging content, manage your blog posts, and share your
								stories with the world
							</p>
						</div>
						<button
							onClick={() => openModal('create')}
							className='w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primaryPurple to-purple-600 text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium'>
							<PlusIcon className='w-5 h-5' />
							Create New Post
						</button>
					</div>
				</div>

				{/* Posts Grid */}
				<div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-8 lg:p-10'>
					{posts.length === 0 ? (
						<div className='text-center py-16 sm:py-20'>
							<div className='bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg'>
								<PhotoIcon className='w-12 h-12 text-primaryPurple' />
							</div>
							<h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3'>
								No blog posts yet
							</h3>
							<p className='text-gray-500 mb-6 text-sm sm:text-base max-w-md mx-auto px-4'>
								Start your content journey by creating your first blog post and
								sharing your thoughts with the world.
							</p>
							<button
								onClick={() => openModal('create')}
								className='inline-flex items-center gap-2 bg-gradient-to-r from-primaryPurple to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium'>
								<PlusIcon className='w-5 h-5' />
								Create Your First Post
							</button>
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
							{posts.map((post) => (
								<div
									key={post.id}
									className='group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1'>
									{/* Image Container with Fixed Aspect Ratio */}
									<div className='relative w-full h-48 sm:h-56 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden'>
										{post.imageUrl ? (
											<img
												src={post.imageUrl}
												alt={post.title}
												className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center'>
												<PhotoIcon className='w-16 h-16 text-purple-300' />
											</div>
										)}
										{/* Video Badge */}
										{post.videoUrl && (
											<div className='absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg'>
												<VideoCameraIcon className='w-4 h-4 text-primaryPurple' />
												<span className='text-xs font-medium text-primaryPurple'>
													Video
												</span>
											</div>
										)}
									</div>

									{/* Content */}
									<div className='p-5'>
										<h3 className='font-bold text-lg sm:text-xl mb-2 line-clamp-2 text-gray-900 group-hover:text-primaryPurple transition-colors duration-300'>
											{post.title}
										</h3>
										<p className='text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed'>
											{post.content}
										</p>

										{/* Date */}
										<div className='flex items-center gap-2 mb-4 pb-4 border-b border-gray-100'>
											<div className='w-2 h-2 bg-primaryPurple rounded-full'></div>
											<p className='text-xs text-gray-500'>
												{formatDate(post.dateCreated)}
											</p>
										</div>

										{/* Action Buttons */}
										<div className='flex items-center gap-2'>
											<button
												onClick={() => openModal('view', post)}
												className='flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-primaryPurple rounded-xl transition-all duration-300 text-sm font-medium group/btn'
												title='View'>
												<EyeIcon className='w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300' />
												<span className='hidden sm:inline'>View</span>
											</button>
											<button
												onClick={() => openModal('edit', post)}
												className='flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 text-sm font-medium group/btn'
												title='Edit'>
												<PencilIcon className='w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300' />
												<span className='hidden sm:inline'>Edit</span>
											</button>
											<button
												onClick={() => handleDelete(post.id)}
												className='p-2.5 text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 group/btn'
												title='Delete'>
												<TrashIcon className='w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300' />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
					<div className='bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl'>
						{/* Modal Header */}
						<div className='flex justify-between items-center p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'>
							<h2 className='text-xl sm:text-2xl font-bold text-primaryPurple'>
								{modalMode === 'create' && 'Create New Blog Post'}
								{modalMode === 'edit' && 'Edit Blog Post'}
								{modalMode === 'view' && ' View Blog Post'}
							</h2>
							<button
								onClick={closeModal}
								className='p-2 hover:bg-white rounded-xl transition-all duration-300 hover:scale-110'>
								<XMarkIcon className='w-6 h-6 text-gray-600' />
							</button>
						</div>

						{/* Modal Content */}
						<div className='p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-140px)]'>
							{modalMode === 'view' ? (
								// View Mode
								<div className='space-y-6'>
									{selectedPost?.imageUrl && (
										<div className='relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg'>
											<img
												src={selectedPost.imageUrl}
												alt={selectedPost.title}
												className='w-full h-full object-cover'
											/>
										</div>
									)}
									<div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6'>
										<h3 className='font-semibold text-sm text-primaryPurple mb-2 uppercase tracking-wide'>
											Title
										</h3>
										<p className='text-gray-900 text-xl font-bold'>
											{selectedPost?.title}
										</p>
									</div>
									<div className='bg-gray-50 rounded-2xl p-6'>
										<h3 className='font-semibold text-sm text-primaryPurple mb-3 uppercase tracking-wide'>
											Content
										</h3>
										<div className='text-gray-700 whitespace-pre-wrap leading-relaxed'>
											{selectedPost?.content}
										</div>
									</div>
									{selectedPost?.videoUrl && (
										<div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6'>
											<h3 className='font-semibold text-sm text-primaryPurple mb-3 uppercase tracking-wide'>
												Video URL
											</h3>
											<a
												href={selectedPost.videoUrl}
												target='_blank'
												rel='noopener noreferrer'
												className='text-primaryPurple hover:underline break-all'>
												{selectedPost.videoUrl}
											</a>
										</div>
									)}
									<div className='bg-gray-50 rounded-2xl p-6'>
										<h3 className='font-semibold text-sm text-primaryPurple mb-2 uppercase tracking-wide'>
											Created
										</h3>
										<p className='text-gray-700'>
											{formatDate(selectedPost?.dateCreated)}
										</p>
									</div>
								</div>
							) : (
								// Create/Edit Mode
								<form
									onSubmit={handleSubmit}
									className='space-y-6'>
									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Title <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											name='title'
											value={formData.title}
											onChange={handleInputChange}
											className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primaryPurple focus:border-transparent transition-all duration-300 ${
												errors.title ? 'border-red-500' : 'border-gray-200'
											}`}
											placeholder='Enter an engaging title...'
										/>
										{errors.title && (
											<p className='text-red-500 text-sm mt-2 flex items-center gap-1'>
												<span className='font-medium'>⚠️</span> {errors.title}
											</p>
										)}
									</div>

									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Content <span className='text-red-500'>*</span>
										</label>
										<textarea
											name='content'
											value={formData.content}
											onChange={handleInputChange}
											rows={10}
											className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primaryPurple focus:border-transparent resize-vertical transition-all duration-300 ${
												errors.content ? 'border-red-500' : 'border-gray-200'
											}`}
											placeholder='Write your amazing content here...'
										/>
										{errors.content && (
											<p className='text-red-500 text-sm mt-2 flex items-center gap-1'>
												<span className='font-medium'>⚠️</span> {errors.content}
											</p>
										)}
									</div>

									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Featured Image
										</label>
										<div className='space-y-4'>
											<div className='flex flex-col sm:flex-row gap-3'>
												<label className='flex-1'>
													<input
														type='file'
														accept='image/*'
														onChange={handleImageUpload}
														className='hidden'
														disabled={imageUploading}
													/>
													<div
														className={`
														flex items-center justify-center gap-3 px-4 py-4 
														border-2 border-dashed rounded-xl cursor-pointer
														transition-all duration-300
														${
															imageUploading
																? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
																: 'border-purple-300 hover:border-primaryPurple hover:bg-purple-50'
														}
													`}>
														{imageUploading ? (
															<>
																<div className='animate-spin rounded-full h-5 w-5 border-2 border-purple-200 border-t-primaryPurple'></div>
																<span className='text-sm font-medium text-gray-600'>
																	Uploading...
																</span>
															</>
														) : (
															<>
																<CloudArrowUpIcon className='w-5 h-5 text-primaryPurple' />
																<span className='text-sm font-medium text-gray-700'>
																	Upload Image
																</span>
															</>
														)}
													</div>
												</label>
												<div className='flex items-center justify-center px-3'>
													<span className='text-sm text-gray-400 font-medium'>
														OR
													</span>
												</div>
											</div>
											<input
												type='url'
												name='imageUrl'
												value={formData.imageUrl}
												onChange={handleInputChange}
												className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primaryPurple focus:border-transparent transition-all duration-300'
												placeholder='Paste image URL here...'
												disabled={imageUploading}
											/>
											{formData.imageUrl && (
												<div className='relative'>
													<div className='relative w-full h-48 rounded-xl overflow-hidden border-2 border-purple-200 shadow-lg'>
														<img
															src={formData.imageUrl}
															alt='Preview'
															className='w-full h-full object-cover'
															onError={(e) => {
																console.log('Image failed to load');
															}}
														/>
													</div>
													<button
														type='button'
														onClick={() =>
															setFormData((prev) => ({ ...prev, imageUrl: '' }))
														}
														className='absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:scale-110'
														title='Remove image'>
														<XMarkIcon className='w-5 h-5' />
													</button>
												</div>
											)}
										</div>
									</div>

									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Video URL (Optional)
										</label>
										<input
											type='url'
											name='videoUrl'
											value={formData.videoUrl}
											onChange={handleInputChange}
											className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primaryPurple focus:border-transparent transition-all duration-300'
											placeholder='https://youtube.com/watch?v=...'
										/>
									</div>

									{(formData.imageUrl || formData.title) && (
										<div className='border-t-2 border-gray-200 pt-6'>
											<h3 className='font-bold text-lg mb-4 text-primaryPurple'>
												Preview
											</h3>
											<div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-inner'>
												{formData.imageUrl && (
													<div className='relative w-full h-48 mb-4 rounded-xl overflow-hidden shadow-lg'>
														<img
															src={formData.imageUrl}
															alt={formData.title || 'Preview'}
															className='w-full h-full object-cover'
															onError={(e) => {
																(e.target as HTMLImageElement).style.display =
																	'none';
															}}
														/>
													</div>
												)}
												<h4 className='font-bold text-xl mb-2 text-gray-900'>
													{formData.title || 'Your Blog Post Title'}
												</h4>
												<p className='text-gray-600 line-clamp-3 leading-relaxed'>
													{formData.content ||
														'Your amazing content will appear here...'}
												</p>
											</div>
										</div>
									)}

									<div className='flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-200'>
										<button
											type='button'
											onClick={closeModal}
											className='w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium'>
											Cancel
										</button>
										<button
											type='submit'
											className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primaryPurple to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium'>
											{modalMode === 'create'
												? '✨ Create Post'
												: '💾 Update Post'}
										</button>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default BlogManagement;
