// Detect if we can use Vue features (Ref/Computed)
import { isRef, unref } from 'vue';

const isVueAvailable = typeof isRef === 'function';

/**
 * Universally resolves a value.
 * - Server: Handles functions and raw values.
 * - Client: Handles Refs, Computed, functions, raw values.
 */
export function universalUnwrap(input: any): any {
	// 1. Handle Vue Refs (Client side)
	if (isVueAvailable && isRef(input)) {
		return unref(input);
	}

	// 2. Handle Getter Functions (Lazy Thunks)
	if (typeof input === 'function') {
		return input();
	}

	// 3. Handle Raw Value or Promise
	return input;
}
