import axios from 'axios';
import { BASE_URL } from '@/config';

export interface Blog {
	id: number;
	adminId: number | null;
	title: string;
	content: string;
	imageUrl: string;
	videoUrl: string;
	dateCreated: number[];
}

const getToken = (): string | null => {
	if (typeof window !== 'undefined') {
		const userDataString = localStorage.getItem('userData');
		if (userDataString) {
			const userData = JSON.parse(userDataString);
			return userData?.token || null;
		}
	}
	return null;
};

/**
 * Convert the API dateCreated array into a JS Date.
 * The API returns [year, month(1-12), day, hour, minute, second, nanoseconds].
 * We treat the nanoseconds part as milliseconds (floor(nanoseconds / 1e6)).
 *
 * Returns a Date in UTC.
 */
export const parseDateCreated = (arr: number[]): Date => {
	if (!Array.isArray(arr) || arr.length < 3) return new Date(NaN);
	const [
		year,
		month, // 1-12 from API
		day,
		hour = 0,
		minute = 0,
		second = 0,
		nanoseconds = 0,
	] = arr.map(Number);

	const milliseconds = Math.floor((nanoseconds ?? 0) / 1e6);
	// Use UTC to avoid timezone shifts; adjust month to 0-based for JS Date.
	return new Date(
		Date.UTC(
			year,
			(month ?? 1) - 1,
			day ?? 1,
			hour,
			minute,
			second,
			milliseconds
		)
	);
};

/**
 * Build headers including Authorization if token is available.
 * Throws when token is required but missing.
 */
const buildAuthHeaders = (requireToken = true) => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	const token = getToken();
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	} else if (requireToken) {
		// Caller expects token; surface a clear error early
		throw new Error('Authentication required: no token found');
	}

	return { headers };
};

/**
 * Get all blogs (requires auth).
 * @returns Array of Blog objects.
 * @throws Error if fetching fails or if no auth token is found.
 */
export const getAllBlogs = async (): Promise<Blog[]> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/user/post/get-all`,
			buildAuthHeaders(true)
		);

		// API returns posts array in data
		const blogs = response.data?.data?.posts || [];
		return blogs;
	} catch (err: unknown) {
		console.error('There was an error fetching blogs', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		// If our buildAuthHeaders threw, it will be re-thrown up here; keep message consistent
		throw new Error('Failed to fetch blogs');
	}
};

/**
 * Get a single blog by id (requires auth).
 * @param id - Blog id (number or string).
 * @returns Blog object.
 * @throws Error if fetching fails, blog not found, or if no auth token is found.
 */
export const getBlogById = async (id: number | string): Promise<Blog> => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/user/post/get/${encodeURIComponent(String(id))}`,
			buildAuthHeaders(true)
		);

		const blog = response.data?.data ?? null;

		if (!blog) {
			throw new Error('Blog not found');
		}

		return blog;
	} catch (err: unknown) {
		console.error(`There was an error fetching blog with id ${id}`, err);

		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}

		throw new Error('Failed to fetch blog by id');
	}
};

/**
 * Create a comment for a blog post
 * @param userId - ID of the user posting the comment
 * @param postId - Blog post ID
 * @param content - The comment text
 */
export const createComment = async (
	userId: number,
	postId: number,
	content: string
) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/api/user/comment/create`,
			{ userId, content, postId },
			buildAuthHeaders(true)
		);
		return response.data;
	} catch (err: unknown) {
		console.error('Error creating comment', err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to post comment');
	}
};

/**
 * Get all comments for a specific blog post
 * @param postId - Blog post ID
 * @returns Array of comments
 */
export const getCommentsByPost = async (postId: number | string) => {
	try {
		const response = await axios.get(
			`${BASE_URL}/api/user/comment/get-by-post/${encodeURIComponent(
				String(postId)
			)}`,
			buildAuthHeaders(true)
		);

		// Extract the array directly
		return response.data?.data?.comments || [];
	} catch (err: unknown) {
		console.error(`Error fetching comments for post ${postId}`, err);
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof (err as any).response?.data?.message === 'string'
		) {
			throw new Error((err as any).response.data.message);
		}
		throw new Error('Failed to fetch comments');
	}
};
