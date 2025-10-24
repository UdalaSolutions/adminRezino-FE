'use client';

import React, {
	createContext,
	useContext,
	useCallback,
	useState,
	ReactNode,
} from 'react';

type MobileNavContextType = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
};

const MobileNavContext = createContext<MobileNavContextType | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((p) => !p), []);

	return (
		<MobileNavContext.Provider value={{ isOpen, open, close, toggle }}>
			{children}
		</MobileNavContext.Provider>
	);
}

export function useMobileNav() {
	const ctx = useContext(MobileNavContext);
	if (!ctx) {
		throw new Error('useMobileNav must be used within a MobileNavProvider');
	}
	return ctx;
}
