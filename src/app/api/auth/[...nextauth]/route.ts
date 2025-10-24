import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

// NextAuth configuration
const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],

	callbacks: {
		// When user signs in with Google
		async signIn({ user, account }) {
			if (account?.provider === 'google' && account?.id_token) {
				console.log('Starting Google sign-in...');
				console.log('Google ID Token:', account.id_token);

				try {
					// Attempt signup
					const signupRes = await axios.post(
						'https://udalae-commercebe.onrender.com/api/user/google-signup',
						{ idToken: account.id_token },
						{
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/json',
							},
							withCredentials: true,
						}
					);

					console.log('Signup response:', signupRes.data);

					const token = signupRes.data?.token;
					const userData = signupRes.data?.user;

					if (token && userData) {
						user.backendToken = token;
						user.backendData = userData;
						console.log('Signup successful — proceeding to session');
						return true;
					}

					console.error(
						'Missing token or user in signup response:',
						signupRes.data
					);
					return false;
				} catch (err: any) {
					console.error('Signup failed:', {
						status: err.response?.status,
						data: err.response?.data,
						message: err.message,
					});

					// Detect if user already exists
					const alreadyExists =
						err.response?.status === 400 ||
						err.response?.status === 409 ||
						(typeof err.response?.data === 'object' &&
							((err.response?.data?.message || '')
								.toLowerCase()
								.includes('already exists') ||
								(err.response?.data?.data || '')
									.toLowerCase()
									.includes('already exists')));

					if (alreadyExists) {
						console.log('User already exists — attempting Google login...');
						try {
							const loginRes = await axios.post(
								'https://udalae-commercebe.onrender.com/api/user/google-login',
								{ idToken: account.id_token },
								{
									headers: {
										'Content-Type': 'application/json',
										Accept: 'application/json',
									},
									withCredentials: true,
								}
							);

							console.log('Login response:', loginRes.data);

							// Adjusted response structure
							const token = loginRes.data?.data?.token;
							const userData = loginRes.data?.data;

							if (token && userData) {
								user.backendToken = token;
								user.backendData = userData;
								console.log('Google login successful — proceeding to session');
								return true;
							}

							console.error(
								'Missing token/user in login response:',
								loginRes.data
							);
							return false;
						} catch (loginErr: any) {
							console.error('Google login failed:', {
								status: loginErr.response?.status,
								data: loginErr.response?.data,
								message: loginErr.message,
							});
							return false;
						}
					}

					// Unexpected signup failure
					return false;
				}
			}

			// Allow other providers
			return true;
		},

		// When creating JWT token
		async jwt({ token, user }) {
			if (user?.backendToken) {
				token.backendToken = user.backendToken;
				token.backendData = user.backendData;
			}
			return token;
		},

		// When creating session (accessible in frontend)
		async session({ session, token }) {
			if (token?.backendToken) {
				session.backendToken = token.backendToken;
				session.backendData = token.backendData;
			}
			return session;
		},
	},

	// Custom pages
	pages: {
		signIn: '/email-verification',
		error: '/auth/error',
	},

	// Use JWT session strategy
	session: { strategy: 'jwt' },
};

// Export NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Extend NextAuth types for custom backend data
declare module 'next-auth' {
	interface User {
		backendToken?: string;
		backendData?: any;
	}
	interface Session {
		backendToken?: string;
		backendData?: any;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		backendToken?: string;
		backendData?: any;
	}
}
