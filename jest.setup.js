import '@testing-library/jest-dom';

// Jest setup: provide a minimal fetch polyfill for components that call fetch in useEffect
// and include testing-library matchers
global.fetch = global.fetch || (() => Promise.resolve({ ok: false, json: async () => ({}) }));

// Polyfill IntersectionObserver for jsdom-based tests
if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
	class MockIntersectionObserver {
		constructor() {}
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() { return []; }
	}
	// eslint-disable-next-line
	// @ts-ignore
	window.IntersectionObserver = MockIntersectionObserver;
	// eslint-disable-next-line
	// @ts-ignore
	global.IntersectionObserver = MockIntersectionObserver;
}
