import { universalUnwrap } from '../../shared/predicate-core'; // Import the helper

// --- 1. Server Definition ---
export function defineServerPredicate<Args extends any[]>(
	fn: (...args: Args) => boolean | Promise<boolean>
) {
	return (...args: Args) => () => fn(...args);
}

// --- 2. Server Logic Gates ---
export function useServerPredicates() {

	// Helper to standardise sync/async checking
	const check = async (input: any): Promise<boolean> => {
		let val = universalUnwrap(input);
		if (val instanceof Promise) val = await val;
		return !!val;
	};

	const and = (...inputs: any[]) => async () => {
		for (const i of inputs) {
			if (!(await check(i))) return false;
		}
		return true;
	};

	const or = (...inputs: any[]) => async () => {
		for (const i of inputs) {
			if (await check(i)) return true;
		}
		return false;
	};

	const not = (input: any) => async () => {
		return !(await check(input));
	};

	/**
	 * Run the predicate chain on the server.
	 * Always async because server predicates might check DBs.
	 */
	const evaluate = async (input: any): Promise<boolean> => {
		return await check(input);
	};

	return { and, or, not, evaluate };
}
