// Shared Types
export type PredicateInput<TResult = boolean> =
	| TResult
	| (() => TResult)
	| (() => Promise<TResult>)
	| Promise<TResult>;

// On client, this extends to include Refs. On server, it's just value/func/promise.
export type ClientPredicateInput = PredicateInput | { value: boolean };

export type PredicateThunk = () => PredicateInput;
