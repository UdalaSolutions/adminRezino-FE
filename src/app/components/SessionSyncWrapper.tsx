'use client';

import useSyncSessionToLocalStorage from '@/hooks/useSyncSessionToLocalStorage';

export default function SessionSyncWrapper() {
	useSyncSessionToLocalStorage();
	return null; // it doesn't render anything
}
