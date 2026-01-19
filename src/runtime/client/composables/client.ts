import { computed, isRef, unref, toValue, type ComputedRef } from 'vue';
import { universalUnwrap } from '../../shared/predicate-core';

// --- 1. Client Definition ---
export function definePredicate<Args extends any[]>(
	fn: (...args: Args) => any // Returns Ref, boolean, or Promise
) {
	return (...args: Args) => () => fn(...args);
}

// --- 2. Client Logic Gates ---
export function usePredicateLogic() {

	// Sync Resolver (for standard checks)
	const resolveC = (Item: any) => {
		let val = universalUnwrap(Item);
		// If unwrapping a function returned another function, unwrap again (recursion)
		if (typeof val === 'function') val = resolveC(val);
		return !!val;
	};

	const and = (...inputs: any[]) => () => inputs.every(resolveC);
	const or = (...inputs: any[]) => () => inputs.some(resolveC);
	const not = (input: any) => () => !resolveC(input);

	// --- 3. Evaluators ---

	// Reactive (Sync) - Returns ComputedRef<boolean>
	const evaluate = (input: any) => computed(() => resolveC(input));

	const evaluateUnref = (input: any) => universalUnwrap(evaluate(input));

	// Async (One-off) - Returns Promise<boolean>
	const evaluateAsync = async (input: any) => {
		let val = universalUnwrap(input);
		if (val instanceof Promise) val = await val;
		if (typeof val === 'function') val = await evaluateAsync(val); // recurse
		return !!val;
	};

	const evaluateAsyncUnref = async (input: any)=> {
		return universalUnwrap(await evaluateAsync(input))
	}

	return { and, or, not, evaluate, evaluateUnref, evaluateAsync, evaluateAsyncUnref };
}
