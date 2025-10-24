'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function useSyncSessionToLocalStorage() {
	const { data: session, status } = useSession();
	const hasSetSession = useRef(false);

	useEffect(() => {
		// Only process when session status is determined (not loading)
		if (status === 'loading') return;

		// If we have a NextAuth session, sync it to localStorage
		if (session?.backendToken && session?.backendData) {
			const tokensObj = { token: session.backendToken as string };

			// Legacy keys used by UI (TopNav)
			localStorage.setItem('authToken', JSON.stringify(tokensObj));
			localStorage.setItem('userData', JSON.stringify(session.backendData));

			// Newer keys used by axios interceptors (AuthService)
			localStorage.setItem('authTokens', JSON.stringify(tokensObj));
			localStorage.setItem('authTimestamp', Date.now().toString());

			// Notify UI listeners
			window.dispatchEvent(new Event('authChange'));
			hasSetSession.current = true;
		}
		// IMPORTANT: Only clear if we previously set data via NextAuth
		// Don't clear if user logged in via custom login form
		else if (status === 'unauthenticated' && hasSetSession.current) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('userData');
			localStorage.removeItem('authTokens');
			localStorage.removeItem('authTimestamp');
			window.dispatchEvent(new Event('authChange'));
			hasSetSession.current = false;
		}
		// If unauthenticated but we never set session, don't touch localStorage
		// This allows custom login to work independently
	}, [session, status]);
}
